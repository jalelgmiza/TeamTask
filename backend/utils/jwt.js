const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const logger = require('../config/logger');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const generateRefreshToken = async (user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await RefreshToken.deleteMany({ userId: user._id }); // Invalidate old tokens
  await RefreshToken.create({ token, userId: user._id, expiresAt });
  logger.info(`Refresh token generated for user: ${user._id}`);
  return token;
};

const verifyRefreshToken = async (token) => {
  const refreshToken = await RefreshToken.findOne({ token });
  if (!refreshToken || refreshToken.expiresAt < new Date()) {
    logger.warn('Invalid or expired refresh token');
    throw new Error('Invalid or expired refresh token');
  }
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
};

module.exports = { generateAccessToken, generateRefreshToken, verifyRefreshToken };