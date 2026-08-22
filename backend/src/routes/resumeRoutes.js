const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');
const {
  getResumes,
  uploadResume,
  setActiveResume,
  deleteResume
} = require('../controllers/resumeController');

router.use(protect);

router.route('/')
  .get(getResumes);

router.post('/upload', upload.single('file'), uploadResume);

router.put('/:id/active', setActiveResume);

router.route('/:id')
  .delete(deleteResume);

module.exports = router;
