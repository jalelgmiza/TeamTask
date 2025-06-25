const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    logger.warn('No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    logger.error(`Invalid token: ${error.message}`);
    res.status(401).json({ message: 'Invalid token' });
  }
};

const managerOnly = (req, res, next) => {
  if (req.user.role !== 'manager') {
    logger.warn(`Unauthorized access attempt by user ${req.user.id}`);
    return res.status(403).json({ message: 'Access restricted to managers' });
  }
  next();
};

module.exports = { authMiddleware, managerOnly };