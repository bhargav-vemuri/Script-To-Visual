// Models listed in priority order — first working model is used
const HF_MODELS = [
  "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
  "https://router.huggingface.co/hf-inference/models/stabilityai/stable-diffusion-2-1-base",
];

/**
 * Generates an image using Hugging Face Inference API.
 * Tries each model in HF_MODELS in order, falling back on error.
 * Returns a base64-encoded data URL string.
 */
async function generateImage(prompt) {
  const hfToken = process.env.HF_API_KEY;

  if (!hfToken || hfToken === 'PASTE_YOUR_TOKEN_HERE') {
    throw new Error('Hugging Face API Key is missing or not set.');
  }

  let lastError = null;

  for (const modelUrl of HF_MODELS) {
    try {
      console.log(`[HF] Trying model: ${modelUrl}`);
      const response = await fetch(modelUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`[HF] Model failed (${response.status}): ${modelUrl} — ${errorText}`);
        lastError = new Error(`Hugging Face API Error: ${response.status} - ${errorText}`);
        continue; // try the next model
      }

      const arrayBuffer = await response.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');
      console.log(`[HF] Image generated successfully with: ${modelUrl}`);
      return `data:image/png;base64,${base64Image}`;
    } catch (error) {
      console.warn(`[HF] Request error for ${modelUrl}: ${error.message}`);
      lastError = error;
    }
  }

  // All models failed
  console.error('[HF] All models exhausted. Last error:', lastError?.message);
  throw new Error('Failed to generate image from Hugging Face. All models unavailable.');
}

module.exports = { generateImage };
