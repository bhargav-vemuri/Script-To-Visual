const express = require('express');
const multer = require('multer');
const {
  listAnalyses,
  getAnalysis,
  deleteAnalysis,
  generateImage,
  advancedAnalyze,
} = require('../controllers/analysisController');

const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

const os = require('os');
const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/analyze', optionalAuth, upload.single('script'), advancedAnalyze);
router.post('/generate-image', optionalAuth, generateImage);
router.get('/analyses', optionalAuth, listAnalyses);
router.get('/analyses/:id', optionalAuth, getAnalysis);
router.delete('/analyses/:id', optionalAuth, deleteAnalysis);

module.exports = router;
