const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Listar todos os usuários
router.get('/', userController.listUsers);

// Editar um usuário
router.post('/:id/edit', userController.editUser);

// Criar um novo usuário
router.post('/create', userController.createUser);

// Excluir um usuário
router.post('/:id/delete', userController.deleteUser);

module.exports = router;
