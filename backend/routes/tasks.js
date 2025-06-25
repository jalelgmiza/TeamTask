const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { authMiddleware, managerOnly } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { taskSchema } = require('../utils/validationSchemas');

router.get('/', authMiddleware, getTasks);
router.post('/', authMiddleware, managerOnly, validate(taskSchema), createTask);
router.put('/:id', authMiddleware, validate(taskSchema), updateTask);
router.delete('/:id', authMiddleware, managerOnly, deleteTask);

module.exports = router;