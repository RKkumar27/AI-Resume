const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getJobRecommendations, getJobs } = require('../controllers/jobController');

router.use(protect);

router.get('/recommendations', getJobRecommendations);
router.get('/', getJobs);

module.exports = router;
