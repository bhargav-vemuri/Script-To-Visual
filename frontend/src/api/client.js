import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

/**
 * Analyze a script — sends either FormData (PDF) or JSON (text).
 * @param {FormData|{scriptText:string, title?:string}} payload
 */
export async function analyzeScript(payload) {
  const isFormData = payload instanceof FormData;
  const res = await api.post('/analyze', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
  });
  return res.data;
}

/** Fetch list of all saved analyses */
export async function fetchAnalyses() {
  const res = await api.get('/analyses');
  return res.data.analyses;
}

/** Fetch one analysis by ID */
export async function fetchAnalysis(id) {
  const res = await api.get(`/analyses/${id}`);
  return res.data.analysis;
}

/** Delete one analysis by ID */
export async function deleteAnalysis(id) {
  const res = await api.delete(`/analyses/${id}`);
  return res.data;
}

/** Generate DALL-E storyboard image for a scene */
export async function generateImage({ prompt, sceneId, analysisId }) {
  const res = await api.post('/generate-image', { prompt, sceneId, analysisId });
  return res.data;
}

export default api;
