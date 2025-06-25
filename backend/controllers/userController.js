const User = require('../models/User');
const logger = require('../config/logger');

const getUsers = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const users = await User.find()
      .select('-password')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments();

    logger.info(`Users fetched by manager: ${req.user.id}, page: ${page}`);
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    logger.error(`Get users error: ${error.message}`);
    throw new Error('Server error');
  }
};

module.exports = { getUsers };