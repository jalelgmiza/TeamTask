const Joi = require('joi');

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('user', 'manager').default('user'),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const taskSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).allow(''),
  status: Joi.string().valid('to-do', 'in-progress', 'completed').default('to-do'),
  assignedTo: Joi.string().hex().length(24).required(),
});

module.exports = { registerSchema, loginSchema, taskSchema };