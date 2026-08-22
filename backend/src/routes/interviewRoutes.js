const express = require('express');
const router = express.Router();
const { getInterviews, saveInterviewSession } = require('../controllers/interviewController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getInterviews);
router.post('/', saveInterviewSession);

module.exports = router;
