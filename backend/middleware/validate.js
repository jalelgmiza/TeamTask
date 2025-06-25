const Joi = require('joi');
const logger = require('../config/logger');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    logger.warn(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
    return res.status(400).json({ message: error.details.map(d => d.message).join(', ') });
  }
  next();
};

module.exports = validate;