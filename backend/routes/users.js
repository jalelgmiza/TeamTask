const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { authMiddleware, managerOnly } = require('../middleware/auth');

router.get('/', authMiddleware, managerOnly, getUsers);

module.exports = router;