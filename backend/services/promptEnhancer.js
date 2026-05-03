/**
 * Enhances a scene/shot description into a rich cinematic image generation prompt.
 * Works with both the Groq schema (camera.shots/movement/angles, visual_style, elements)
 * and the legacy Ollama schema (shots[].shot_type).
 */
function enhancePrompt(scene, shot) {
  const baseParts = [
    'cinematic film still',
    'professional movie cinematography',
    'dramatic lighting',
    '35mm anamorphic lens',
    'ultra realistic',
    'highly detailed',
    '8K resolution',
    'sharp focus',
  ];

  // Scene description
  if (scene.description) baseParts.push(scene.description);
  if (scene.location) baseParts.push(`location: ${scene.location}`);
  if (scene.time) baseParts.push(scene.time);

  // Mood
  if (scene.mood?.length) {
    baseParts.push(`${scene.mood.join(', ')} mood`);
  }

  // --- Groq schema: scene.camera.{ shots, movement, angles } ---
  const cam = scene.camera || {};
  if (cam.shots?.length) baseParts.push(cam.shots[0]);
  if (cam.angles?.length) baseParts.push(cam.angles[0]);
  if (cam.movement?.length) baseParts.push(`camera ${cam.movement[0]}`);

  // --- Groq schema: scene.visual_style ---
  const vs = scene.visual_style || {};
  if (vs.lighting) baseParts.push(vs.lighting);
  if (vs.color_palette) baseParts.push(vs.color_palette);
  if (vs.style_reference) baseParts.push(`in the style of ${vs.style_reference}`);

  // --- Legacy Ollama schema: shot object with shot_type, description ---
  if (shot) {
    if (shot.shot_type) baseParts.push(shot.shot_type);
    if (shot.angle) baseParts.push(shot.angle);
    if (shot.camera_movement) baseParts.push(shot.camera_movement);
    if (shot.description) baseParts.push(shot.description);
  }

  // Negative prompt signal (will not apply to all models but helps FLUX)
  const prompt = baseParts
    .filter(Boolean)
    .map(p => p.trim())
    .filter(p => p.length > 0)
    .join(', ');

  return prompt;
}

module.exports = { enhancePrompt };
