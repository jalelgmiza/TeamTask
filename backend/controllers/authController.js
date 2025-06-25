const User = require('../models/User');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const logger = require('../config/logger');

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    user = new User({ username, email, password, role });
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    logger.info(`User registered: ${user._id}`);
    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, username, email, role },
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    throw new Error('Server error');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    logger.info(`User logged in: ${user._id}`);
    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email, role: user.role },
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    throw new Error('Server error');
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  try {
    const payload = await verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.id);
    if (!user) return res.status(400).json({ message: 'Invalid user' });

    const accessToken = generateAccessToken(user);
    const newRefreshToken = await generateRefreshToken(user); // Rotate refresh token

    logger.info(`Token refreshed for user: ${user._id}`);
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    res.status(401).json({ message: error.message });
  }
};

module.exports = { register, login, refreshToken };