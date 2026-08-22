const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret_fallback');
      req.user = await User.findById(decoded.id).select('-passwordHash');
      return next();
    } catch (error) {
      return res.status(401).json({ status: 'error', message: 'Not authorized, token failed' });
    }
  }

  // Fallback demo user for development if no token passed
  if (process.env.NODE_ENV !== 'production' && !token) {
    req.user = {
      _id: '66c5d10a2f1b4c9e8f000001',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      role: 'user',
      targetRole: 'Senior Full Stack Engineer'
    };
    return next();
  }

  return res.status(401).json({ status: 'error', message: 'Not authorized, no token provided' });
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        status: 'error', 
        message: `User role '${req.user?.role}' is not authorized to access this route` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
