const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.render('layout', {
        title: 'Login',
        body: 'pages/login',
        error: 'Email e senha são obrigatórios.',
        user: req.session.user || null,
      });
    }

    // Validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.render('layout', {
        title: 'Login',
        body: 'pages/login',
        error: 'Email inválido.',
        user: req.session.user || null,
      });
    }

    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.render('layout', {
          title: 'Login',
          body: 'pages/login',
          error: 'Usuário não encontrado.',
          user: req.session.user || null,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('layout', {
          title: 'Login',
          body: 'pages/login',
          error: 'Senha incorreta.',
          user: req.session.user || null,
        });
      }

      req.session.user = { id: user.id, email: user.email, role: user.role };
      res.redirect('/');
    } catch (error) {
      console.error('Erro ao fazer login:', error.message);
      res.status(500).send('Erro interno.');
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/login');
    });
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.render('layout', {
        title: 'Esqueceu a Senha',
        body: 'pages/forgot',
        error: 'O email é obrigatório.',
        user: req.session.user || null,
      });
    }

    // Simular envio de e-mail de recuperação
    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.render('layout', {
          title: 'Esqueceu a Senha',
          body: 'pages/forgot',
          error: 'Usuário não encontrado.',
          user: req.session.user || null,
        });
      }

      console.log(`Enviando email de recuperação para ${email}`); // Simular envio de e-mail
      res.render('layout', {
        title: 'Esqueceu a Senha',
        body: 'pages/forgot',
        error: 'Se o email existir, uma mensagem será enviada.',
        user: req.session.user || null,
      });
    } catch (error) {
      console.error('Erro ao processar recuperação de senha:', error.message);
      res.status(500).send('Erro interno.');
    }
  },
};