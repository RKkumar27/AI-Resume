const Interview = require('../models/Interview');

const getInterviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await Interview.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ status: 'success', count: sessions.length, data: sessions });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const saveInterviewSession = async (req, res) => {
  try {
    const userId = req.user._id;
    const session = await Interview.create({ ...req.body, userId });
    res.status(201).json({ status: 'success', data: session });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getInterviews, saveInterviewSession };
