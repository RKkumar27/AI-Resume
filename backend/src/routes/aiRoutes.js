const express = require('express');
const router = express.Router();
const { analyzeResume, matchJob, generateInterview, evaluateAnswer } = require('../controllers/aiController');

router.post('/analyze-resume', analyzeResume);
router.post('/match-job', matchJob);
router.post('/generate-interview', generateInterview);
router.post('/evaluate-answer', evaluateAnswer);

module.exports = router;
