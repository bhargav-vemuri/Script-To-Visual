const express = require('express');
const multer = require('multer');
const {
  analyzeScriptController,
  listAnalyses,
  getAnalysis,
  deleteAnalysis,
  generateImage,
  analyzeScriptSSE,
  advancedAnalyze,
} = require('../controllers/analysisController');

const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Store uploaded files in memory (buffer) so pdf-parse can read them
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/analyze', optionalAuth, upload.single('script'), advancedAnalyze);
router.post('/analyze-script', optionalAuth, upload.single('script'), analyzeScriptController);
router.post('/analyze-script-stream', optionalAuth, upload.single('script'), analyzeScriptSSE);
router.post('/generate-image', optionalAuth, generateImage);
router.get('/analyses', optionalAuth, listAnalyses);
router.get('/analyses/:id', optionalAuth, getAnalysis);
router.delete('/analyses/:id', optionalAuth, deleteAnalysis);

module.exports = router;
