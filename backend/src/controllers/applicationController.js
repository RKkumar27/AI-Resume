const Application = require('../models/Application');

const getApplications = async (req, res) => {
  try {
    const userId = req.user._id;
    const apps = await Application.find({ userId }).sort({ appliedAt: -1 });
    res.status(200).json({ status: 'success', count: apps.length, data: apps });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const createApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const app = await Application.create({ ...req.body, userId });
    res.status(201).json({ status: 'success', data: app });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    const app = await Application.findByIdAndUpdate(id, { status, notes }, { new: true });
    res.status(200).json({ status: 'success', data: app });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;
    await Application.findByIdAndDelete(id);
    res.status(200).json({ status: 'success', message: 'Application deleted' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = { getApplications, createApplication, updateApplicationStatus, deleteApplication };
