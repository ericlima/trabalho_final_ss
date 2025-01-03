const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('layout', { 
        title: 'Login',
        body: 'pages/login',
        error: 'Email e senha são obrigatórios.'
      });
    }

    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.render('layout', { 
          title: 'Login',
          body: 'pages/login',
          error: 'Usuário não encontrado.'
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('layout', { 
          title: 'Login',
          body: 'pages/login',
          error: 'Senha incorreta.'
        });
      }

      req.session.user = { id: user.id, email: user.email, role: user.role };
      res.redirect('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      res.status(500).send('Erro interno.');
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  },
};
