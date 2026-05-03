const mongoose = require('mongoose');
const Analysis = require('../models/Analysis');
const { analyzeScript, generateStoryboard, analyzeScriptStream } = require('../services/openaiService');
const { enhancePrompt } = require('../services/promptEnhancer');
const { generateImage: hfGenerateImage } = require('../services/imageService');
const pdfParse = require('pdf-parse');

/** Check if Mongoose is currently connected to MongoDB */
const isDbConnected = () => mongoose.connection.readyState === 1;

/**
 * POST /api/analyze-script
 * Accepts multipart form data (PDF file) OR a JSON body (raw text).
 * If MongoDB is unavailable, the analysis is still returned but not persisted.
 */
async function analyzeScriptController(req, res) {
  let scriptText = '';
  let title = req.body.title || 'Untitled Script';

  // ── Parse input ────────────────────────────────────────────────────────────
  if (req.file) {
    const data = await pdfParse(req.file.buffer);
    scriptText = data.text;
    if (!title || title === 'Untitled Script') {
      title = req.file.originalname.replace(/\.[^.]+$/, '');
    }
  } else if (req.body.scriptText) {
    scriptText = req.body.scriptText;
  } else {
    return res.status(400).json({ error: 'No script text or file provided.' });
  }

  if (scriptText.trim().length < 50) {
    return res.status(400).json({
      error: 'Script is too short to analyze. Please provide at least 50 characters.',
    });
  }

  // Truncate to stay within token limits (~12 000 chars ≈ ~3 000 tokens)
  const truncated = scriptText.slice(0, 12000);

  // ── Run AI analysis ────────────────────────────────────────────────────────
  const scenes = await analyzeScript(truncated);

  // ── Persist (if DB is available) ───────────────────────────────────────────
  let analysis = { _id: `temp_${Date.now()}`, title, scriptText: truncated, scenes, createdAt: new Date() };

  if (isDbConnected()) {
    try {
      const payload = { title, scriptText: truncated, scenes };
      if (req.user && req.user.userId) payload.userId = req.user.userId;
      
      const saved = await Analysis.create(payload);
      analysis = saved.toObject();
    } catch (dbErr) {
      console.warn('[WARN] Could not save analysis to DB:', dbErr.message);
    }
  } else {
    console.warn('[WARN] MongoDB not connected — analysis will not be persisted.');
  }

  return res.status(201).json({ success: true, analysis });
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
 * POST /api/analyze-script-stream
 * SSE streaming version of the analysis endpoint.
 * Streams raw JSON deltas to the client, then sends a final 'done' event with the saved analysis.
 */
async function analyzeScriptSSE(req, res) {
  let scriptText = '';
  let title = req.body.title || 'Untitled Script';

  if (req.file) {
    const data = await pdfParse(req.file.buffer);
    scriptText = data.text;
    if (!title || title === 'Untitled Script') {
      title = req.file.originalname.replace(/\.[^.]+$/, '');
    }
  } else if (req.body.scriptText) {
    scriptText = req.body.scriptText;
  } else {
    return res.status(400).json({ error: 'No script text or file provided.' });
  }

  if (scriptText.trim().length < 50) {
    return res.status(400).json({ error: 'Script is too short. Please provide at least 50 characters.' });
  }

  const truncated = scriptText.slice(0, 12000);

  // Set SSE headers
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });

  let fullContent = '';

  try {
    const stream = await analyzeScriptStream(truncated);

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullContent += delta;
        // Send each delta as an SSE event
        res.write(`data: ${JSON.stringify({ type: 'delta', content: delta })}\n\n`);
      }
    }

    // Clean potential markdown blocks before parsing
    const cleanJsonStr = fullContent.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();
    const parsed = JSON.parse(cleanJsonStr);
    const scenes = parsed.scenes || [];

    // Persist if DB is available
    let analysis = { _id: `temp_${Date.now()}`, title, scriptText: truncated, scenes, createdAt: new Date() };

    if (isDbConnected()) {
      try {
        const payload = { title, scriptText: truncated, scenes };
        if (req.user && req.user.userId) payload.userId = req.user.userId;
        const saved = await Analysis.create(payload);
        analysis = saved.toObject();
      } catch (dbErr) {
        console.warn('[WARN] Could not save analysis to DB:', dbErr.message);
      }
    }

    // Send final event with the complete analysis
    res.write(`data: ${JSON.stringify({ type: 'done', analysis })}\n\n`);
    res.end();
  } catch (err) {
    console.error('[ERROR] Stream error:', err.message);
    res.write(`data: ${JSON.stringify({ type: 'error', error: err.message })}\n\n`);
    res.end();
  }
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
 * POST /api/analyze
 * Sequential processing using Groq LLM and Hugging Face API.
 */
async function advancedAnalyze(req, res) {
  let scriptText = '';
  let title = req.body.title || 'Untitled Script';

  if (req.file) {
    const data = await pdfParse(req.file.buffer);
    scriptText = data.text;
    if (!title || title === 'Untitled Script') {
      title = req.file.originalname.replace(/\.[^.]+$/, '');
    }
  } else if (req.body.scriptText) {
    scriptText = req.body.scriptText;
  } else {
    return res.status(400).json({ error: 'No script text or file provided.' });
  }

  const rawScenes = parseScript(scriptText).slice(0, 8); // Max 8 scenes
  const processedScenes = [];

  for (let i = 0; i < rawScenes.length; i++) {
    try {
      console.log(`Processing scene ${i + 1}/${rawScenes.length}...`);
      
      // 1. LLM Breakdown using the advanced Groq prompt
      const scenesFromLlm = await analyzeScript(rawScenes[i]);
      const sceneData = Array.isArray(scenesFromLlm) ? scenesFromLlm[0] : scenesFromLlm;

      if (!sceneData) continue;

      // 2. Prompt Enhancement
      const firstShot = sceneData.shots && sceneData.shots[0] ? sceneData.shots[0] : null;
      const enhancedPrompt = enhancePrompt(sceneData, firstShot);

      // 3. Image Generation
      const imageUrl = await hfGenerateImage(enhancedPrompt);

      sceneData.imageUrl = imageUrl;
      sceneData.scene_number = i + 1;
      processedScenes.push(sceneData);

    } catch (err) {
      console.error(`[ERROR] Scene ${i + 1} failed:`, err.message);
      // Add a placeholder or skip? skipping for now to keep it clean
    }
  }

  // 4. Persistence
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
    } catch (dbErr) {
      console.warn('[WARN] Could not save analysis:', dbErr.message);
    }
  }

  return res.json({ success: true, analysis });
}

module.exports = { 
  analyzeScriptController, 
  listAnalyses, 
  getAnalysis, 
  deleteAnalysis, 
  generateImage, 
  analyzeScriptSSE,
  advancedAnalyze 
};
