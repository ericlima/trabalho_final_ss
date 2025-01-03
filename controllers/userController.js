const userModel = require('../models/userModel');

module.exports = {
  // Listar todos os usuários
  listUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.render('layout', { 
        title: 'Usuários',
        body: 'pages/users',
        error: '',
        users: users 
      });
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.render('layout', { 
        title: 'Usuários',
        body: 'pages/users',
        error: 'Erro ao carregar usuários.',
        users: []
      });
    }
  },

  // Editar um usuário
  editUser: async (req, res) => {
    const { id } = req.params;
    const { email, role } = req.body;

    try {
      await userModel.updateUser(id, { email, role });
      res.redirect('/users');
    } catch (error) {
      console.error('Erro ao editar usuário:', error);
      res.status(500).send('Erro ao editar usuário.');
    }
  },

  // Criar um novo usuário (opcional)
  createUser: async (req, res) => {
    const { email, password, role } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      await userModel.createUser({ email, password: hashedPassword, role });
      res.redirect('/users');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      res.status(500).send('Erro ao criar usuário.');
    }
  },

  // Excluir um usuário (opcional)
  deleteUser: async (req, res) => {
    const { id } = req.params;

    try {
      await userModel.deleteUser(id);
      res.redirect('/users');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      res.status(500).send('Erro ao excluir usuário.');
    }
  },
};
