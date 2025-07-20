const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Rutas de usuarios
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);

module.exports = router;
