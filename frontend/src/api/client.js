import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '';
const api = axios.create({ baseURL: `${API_URL}/api` });

/**
 * Analyze a script — ensures 'script' field is always a file for the backend.
 * @param {File|string} payload - Either a File object or raw script text.
 * @param {string} title - Optional title for the script.
 */
export async function analyzeScript(payload, title = '') {
  const formData = new FormData();
  
  if (typeof payload === 'string') {
    // If text is provided, convert it to a File to satisfy backend upload requirement
    const blob = new Blob([payload], { type: 'text/plain' });
    formData.append('script', blob, 'script.txt');
  } else {
    // payload is already a File object
    formData.append('script', payload);
  }

  if (title) {
    formData.append('title', title);
  }

  const res = await api.post('/analyze', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
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
