const { getDBStatus } = require('../config/db');

/**
 * @desc    Health check endpoint for API monitoring
 * @route   GET /api/health
 * @access  Public
 */
const getHealthStatus = (req, res) => {
  const dbState = getDBStatus();
  
  res.status(200).json({
    status: 'ok',
    service: 'main-backend-api',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbState
    }
  });
};

module.exports = { getHealthStatus };
