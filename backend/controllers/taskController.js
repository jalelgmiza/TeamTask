const Task = require('../models/Task');
const logger = require('../config/logger');

const getTasks = async (req, res) => {
  const { page = 1, limit = 10, status } = req.query;
  try {
    const query = req.user.role === 'manager'
      ? status ? { status } : {}
      : { assignedTo: req.user.id, ...(status && { status }) };
    const tasks = await Task.find(query)
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Task.countDocuments(query);

    logger.info(`Tasks fetched for user: ${req.user.id}, page: ${page}`);
    res.json({ tasks, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    logger.error(`Get tasks error: ${error.message}`);
    throw new Error('Server error');
  }
};

const createTask = async (req, res) => {
  const { title, description, status, assignedTo } = req.body;
  try {
    const task = new Task({ title, description, status, assignedTo, createdBy: req.user.id });
    await task.save();
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    logger.info(`Task created: ${task._id} by user: ${req.user.id}`);
    res.status(201).json(populatedTask);
  } catch (error) {
    logger.error(`Create task error: ${error.message}`);
    throw new Error('Server error');
  }
};

const updateTask = async (req, res) => {
  const { title, description, status, assignedTo } = req.body;
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (req.user.role !== 'manager' && task.assignedTo.toString() !== req.user.id) {
      logger.warn(`Unauthorized task update attempt by user: ${req.user.id}`);
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.user.role !== 'manager' && assignedTo) {
      logger.warn(`Unauthorized task reassignment attempt by user: ${req.user.id}`);
      return res.status(403).json({ message: 'Only managers can reassign tasks' });
    }

    Object.assign(task, { title, description, status, assignedTo });
    await task.save();
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'username')
      .populate('createdBy', 'username');

    logger.info(`Task updated: ${task._id} by user: ${req.user.id}`);
    res.json(populatedTask);
  } catch (error) {
    logger.error(`Update task error: ${error.message}`);
    throw new Error('Server error');
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    await task.deleteOne();
    logger.info(`Task deleted: ${task._id} by user: ${req.user.id}`);
    res.json({ message: 'Task deleted' });
  } catch (error) {
    logger.error(`Delete task error: ${error.message}`);
    throw new Error('Server error');
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };