const mongoose = require('mongoose');
const Analysis = require('../models/Analysis');
const { analyzeScript } = require('../services/openaiService');
const { enhancePrompt } = require('../services/promptEnhancer');
const { generateImage: hfGenerateImage } = require('../services/imageService');
const pdfParse = require('pdf-parse');
const fs = require('fs');

/** Check if Mongoose is currently connected to MongoDB */
const isDbConnected = () => mongoose.connection.readyState === 1;

// ── Global Image Generation Queue (In-Memory) ────────────────────────────────
// Prevents Hugging Face rate limits and Node.js socket exhaustion at scale.
const imageQueue = [];
let isQueueProcessing = false;

async function processQueue() {
  if (isQueueProcessing) return;
  isQueueProcessing = true;
  while (imageQueue.length > 0) {
    const task = imageQueue.shift();
    try {
      await task();
      // Sleep 1s between HF calls to respect rate limits
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.warn('[WARN] Background image task failed:', e.message);
    }
  }
  isQueueProcessing = false;
}

/**
 * Helper to split script into scenes based on INT/EXT headings.
 */
function parseScript(text) {
  const sceneHeadings = /(INT\.|EXT\.|INT\/EXT\.)/i;
  const parts = text.split(sceneHeadings);
  
  const scenes = [];
  // parts[0] is everything before the first heading
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i];
    const content = parts[i + 1] || "";
    scenes.push(heading + content);
  }
  
  if (scenes.length === 0) {
    return [text];
  }
  
  return scenes;
}

/**
 * GET /api/analyses
 * Returns all saved analyses (most recent first), with scene list for previews.
 */
async function listAnalyses(req, res) {
  if (!isDbConnected()) {
    return res.json({ analyses: [] });
  }
  
  const query = {};
  if (req.user && req.user.userId) {
    query.userId = req.user.userId;
  }
  
  const analyses = await Analysis.find(query, 'title createdAt scenes').sort({ createdAt: -1 });
  return res.json({ analyses });
}

/**
 * GET /api/analyses/:id
 * Returns one full analysis document by ID.
 */
async function getAnalysis(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable. Please start MongoDB.' });
  }
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found.' });
  
  // Check ownership
  if (analysis.userId && (!req.user || req.user.userId !== analysis.userId.toString())) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  return res.json({ analysis });
}

/**
 * DELETE /api/analyses/:id
 * Deletes one analysis document by ID.
 */
async function deleteAnalysis(req, res) {
  if (!isDbConnected()) {
    return res.status(503).json({ error: 'Database unavailable.' });
  }
  
  const analysis = await Analysis.findById(req.params.id);
  if (!analysis) return res.status(404).json({ error: 'Analysis not found.' });
  
  if (analysis.userId && (!req.user || req.user.userId !== analysis.userId.toString())) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  await Analysis.findByIdAndDelete(req.params.id);
  return res.json({ success: true });
}

/**
 * POST /api/generate-image
 * Generates an image on demand
 */
async function generateImage(req, res) {
  const { prompt, sceneId, analysisId } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });

  try {
    const imageUrl = await hfGenerateImage(prompt);
    
    // Optional: Save the image URL back to the DB scene
    if (analysisId && sceneId && isDbConnected()) {
      await Analysis.findOneAndUpdate(
        { _id: analysisId, 'scenes._id': sceneId },
        { $set: { 'scenes.$.imageUrl': imageUrl } }
      );
    }
    
    return res.json({ imageUrl });
  } catch (err) {
    console.error('Hugging Face Error:', err);
    return res.status(500).json({ error: 'Failed to generate image.' });
  }
}

/**
 * POST /api/analyze
 * Sequential processing using Groq LLM and Hugging Face API.
 */
async function advancedAnalyze(req, res) {
  let scriptText = '';
  let title = req.body.title || 'Untitled Script';

  if (req.file) {
    try {
      // Read from disk storage
      const data = await pdfParse(fs.readFileSync(req.file.path));
      scriptText = data.text;
      if (!title || title === 'Untitled Script') {
        title = req.file.originalname.replace(/\.[^.]+$/, '');
      }
      // Clean up tmp file
      fs.unlinkSync(req.file.path);
    } catch (parseErr) {
      return res.status(500).json({ error: 'Failed to parse PDF file.' });
    }
  } else if (req.body.scriptText) {
    scriptText = req.body.scriptText;
  } else {
    return res.status(400).json({ error: 'No script text or file provided.' });
  }

  if (scriptText.trim().length < 50) {
    return res.status(400).json({ error: 'Script is too short. Please provide at least 50 characters.' });
  }

  const rawScenes = parseScript(scriptText).slice(0, 8); // Max 8 scenes
  const processedScenes = [];

  for (let i = 0; i < rawScenes.length; i++) {
    try {
      console.log(`Processing scene ${i + 1}/${rawScenes.length}...`);
      
      // LLM Breakdown using the advanced Groq prompt
      const scenesFromLlm = await analyzeScript(rawScenes[i]);
      const sceneData = Array.isArray(scenesFromLlm) ? scenesFromLlm[0] : scenesFromLlm;

      if (!sceneData) continue;

      // Assign scene number (image is generated on-demand from the frontend)
      sceneData.scene_number = i + 1;
      processedScenes.push(sceneData);

    } catch (err) {
      console.error(`[ERROR] Scene ${i + 1} failed:`, err.message);
    }
  }

  // Persist first so we have an ID, then push image generation to the global background queue
  let analysis = { 
    _id: `temp_${Date.now()}`, 
    title, 
    scriptText: scriptText.slice(0, 5000), 
    scenes: processedScenes, 
    createdAt: new Date() 
  };

  if (isDbConnected()) {
    try {
      const payload = { 
        title, 
        scriptText: scriptText.slice(0, 5000), 
        scenes: processedScenes 
      };
      if (req.user && req.user.userId) payload.userId = req.user.userId;
      const saved = await Analysis.create(payload);
      analysis = saved.toObject();

      // Enqueue storyboard image generation tasks
      const analysisId = saved._id;
      for (let i = 0; i < processedScenes.length; i++) {
        const scene = processedScenes[i];
        const firstShot = scene.shots && scene.shots[0] ? scene.shots[0] : null;
        const enhancedPrompt = enhancePrompt(scene, firstShot);
        
        // Push task to global queue
        imageQueue.push(async () => {
          console.log(`Generating image for Analysis ${analysisId}, Scene ${scene.scene_number}`);
          const imageUrl = await hfGenerateImage(enhancedPrompt);
          await Analysis.findOneAndUpdate(
            { _id: analysisId, 'scenes.scene_number': scene.scene_number },
            { $set: { 'scenes.$.imageUrl': imageUrl } }
          );
        });
      }
      
      // Trigger queue processing
      processQueue();

    } catch (dbErr) {
      console.warn('[WARN] Could not save analysis:', dbErr.message);
    }
  }

  return res.json({ success: true, analysis });
}

module.exports = { 
  listAnalyses, 
  getAnalysis, 
  deleteAnalysis, 
  generateImage, 
  advancedAnalyze 
};
