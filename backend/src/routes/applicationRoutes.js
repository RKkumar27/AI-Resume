const express = require('express');
const router = express.Router();
const { getApplications, createApplication, updateApplicationStatus, deleteApplication } = require('../controllers/applicationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/', getApplications);
router.post('/', createApplication);
router.patch('/:id', updateApplicationStatus);
router.delete('/:id', deleteApplication);

module.exports = router;
