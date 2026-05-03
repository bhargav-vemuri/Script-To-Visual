const OpenAI = require('openai');

const client = new OpenAI({ 
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Builds a rich, expert-level cinematic analysis prompt with shot division and sound design.
 * @param {string} scriptText - Raw script content from the user.
 * @returns {string} Full prompt string.
 */
function buildPrompt(scriptText) {
  return `You are an elite Director of Photography, script supervisor, film composer consultant, and editor with 30+ years of experience working on award-winning films across global cinema (including Hollywood, Tollywood, Bollywood, Sandalwood, and independent world cinema).

Analyze the following script with the precision of a full pre-production breakdown. Extract cinematic, compositional, sonic, and editorial insights for EVERY scene. Your analysis must be DERIVED FROM THE ACTUAL CONTENT OF THE SCRIPT — not generic or cliché.

CRITICAL: 
- The "description" field must be YOUR OWN cinematic interpretation of the scene written as a DoP's shot note. Do NOT copy or paraphrase the script text verbatim. Write what the camera sees, the spatial composition, and the emotional subtext.
- Music and editing must reflect the SPECIFIC emotional beats of this scene — not generic film music tropes.
- Shot division must logically decompose how a director would actually shoot this specific scene.

Return ONLY a valid JSON object — absolutely no markdown, no code blocks, no explanations, no extra text. Just raw JSON.

Use this EXACT schema for every scene:
{
  "scenes": [
    {
      "scene_number": 1,
      "location": "Specific, vivid location name (e.g. 'Fog-soaked railway platform, pre-dawn Mumbai')",
      "time": "Time + atmospheric qualifier (e.g. 'Golden Hour — the last light of day', 'Deep Night — 3 AM silence')",
      "description": "Your cinematic DoP-style description: 2-3 sentences describing what the CAMERA SEES — composition, spatial relationships, character blocking, and emotional subtext. Written like shot notes. Do NOT copy the script.",
      "mood": ["7 specific adjectives that inform color grade and lighting — avoid generic words like 'sad/happy/angry'"],
      "camera": {
        "shots": ["primary shot type", "secondary shot type", "tertiary shot type"],
        "movement": ["movement with motivation, e.g. 'slow dolly push-in as character breaks down'"],
        "angles": ["angle with intent, e.g. 'low angle (reinforcing power shift)'"]
      },
      "visual_style": {
        "lighting": "Professional lighting description using DoP terminology — mention key/fill ratio, color temperature, practical sources",
        "color_palette": "Specific palette with emotional intent and color science (e.g. 'complementary teal/amber tension — warm skin against cold environment')",
        "style_reference": "Film title — DoP name — specific visual quality (e.g. 'Prisoners — Roger Deakins — oppressive grey overcast flattening all warmth')"
      },
      "elements": {
        "characters": ["Character — physical state, emotional register, and position in frame"],
        "props": ["Prop — its narrative significance in this scene"],
        "actions": ["Beat 1: specific action — what triggers it", "Beat 2: specific reaction — internal/external", "Beat 3: outcome — how the scene leaves each character"]
        "color_palette": ["#1A1A1A", "#8B0000", "#FFD700"],
        "style_reference": "Name a specific film, the DoP, and exactly what visual element to emulate (e.g. 'Roger Deakins in Sicario — the suffocating use of negative space in daylight').",
        "elements": ["Atmospheric smoke", "Neon reflection", "Rain on glass"]
      },
      "shot_division": [
        {
          "shot_number": 1,
          "shot_type": "Specific framing (e.g. 'Extreme Close-Up', 'Wide Master')",
          "angle": "Camera elevation and tilt (e.g. 'High angle, objective', 'Low angle, confrontational')",
          "movement": "Kinetic description (e.g. 'Steadicam tracking backward', 'Static, locked-off')",
          "lens": "Focal length and distortion (e.g. '14mm wide — distorting the edges', '135mm long lens — compressing the background')",
          "description": "What is the blocking? What does the camera literally see? Write as a DoP translating subtext to visuals. Do not echo script dialogue.",
          "duration": "Estimated time (e.g. '12-15 seconds')",
          "purpose": "What psychological or narrative goal does this specific shot achieve?"
        }
      ],
      "sound_design": {
        "music": {
          "genre": "Specific genre derived from scene's emotional texture (e.g. 'Distorted ambient drone', 'Percussive tension underscore')",
          "tempo": "Tempo mirroring emotional rhythm (e.g. 'Accelerating pulse — 60 to 140 BPM', 'Glacially slow — near static')",
          "instruments": ["Specific instruments chosen for emotional resonance — explain WHY"],
          "reference": "Specific composer/track reference (e.g. 'Hans Zimmer — Dunkirk — Shepard tone for rising panic')",
          "emotional_intent": "What the music must achieve emotionally based on the script's subtext."
        },
        "editing": {
          "style": "Editing philosophy (e.g. 'Elliptical time jumps', 'Classical continuity')",
          "cut_type": "Types of cuts used (e.g. 'Match-cut on eyeline', 'J-cut to introduce dread before visual')",
          "rhythm": "Rhythmic flow (e.g. 'Long takes allowing silence to press down', 'Staccato cross-cutting')",
          "transition": "Scene entry/exit (e.g. 'Smash cut to black', 'Slow, lingering dissolve out')",
          "pacing_note": "Specific note on pacing derived from what THIS scene needs emotionally."
        }
      }
    }
  ]
}

PROFESSIONAL RULES — violations are unacceptable:
1. description: Write as DoP notes. What does the camera literally see? Composition, depth, blocking. NEVER echo the script dialogue or stage directions.
2. mood: Use precise cinematic adjectives (e.g. "sepulchral", "feverish", "glacial", "volatile", "suffocating", "elegiac"). Never: "sad", "happy", "angry".
3. shot_division: Provide 4-7 shots that LOGICALLY DECOMPOSE how this scene would be filmed. Each shot must have clear narrative purpose.
4. sound_design.music: Must be DERIVED FROM THE EMOTIONAL DNA OF THIS SPECIFIC SCENE — not generic "orchestral" or "dramatic music". Reference specific composers/tracks that match.
5. sound_design.editing: Editing rhythm must reflect the emotional beats of THIS scene specifically.
6. visual_style.style_reference: Always include Film + DoP + specific quality of that film's visual approach.
7. All arrays must have meaningful entries — no empty arrays, no placeholder text.

SCRIPT TO ANALYZE:
${scriptText}`;
}

/**
 * Sends script text to Groq and returns the parsed scenes array.
 * @param {string} scriptText
 * @returns {Promise<Array>} Array of scene objects.
 */
async function analyzeScript(scriptText) {
  const prompt = buildPrompt(scriptText);

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You are a world-class film Director of Photography, script supervisor, composer consultant, and editor with vast experience in global cinema. You produce expert cinematic pre-production breakdowns. Return ONLY raw valid JSON — no markdown, no code fences, no explanations. Just the JSON object.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.35,
    max_tokens: 8000,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0].message.content;
  const parsed = JSON.parse(raw);
  return parsed.scenes || [];
}

async function generateStoryboard(prompt) {
  throw new Error("Storyboard generation is not supported with the Groq API. Please switch back to an OpenAI key to use DALL-E 3.");
}

/**
 * Streaming version — returns the Groq stream object for SSE piping.
 */
async function analyzeScriptStream(scriptText) {
  const prompt = buildPrompt(scriptText);

  const stream = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a world-class film Director of Photography, script supervisor, composer consultant, and editor with vast experience in global cinema. You produce expert cinematic pre-production breakdowns. Return ONLY raw valid JSON — no markdown, no code fences, no explanations. Just the JSON object.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.35,
    max_tokens: 8000,
    response_format: { type: 'json_object' },
    stream: true,
  });

  return stream;
}

module.exports = { analyzeScript, generateStoryboard, analyzeScriptStream };
