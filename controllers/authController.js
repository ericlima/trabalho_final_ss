const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      console.error('Email e senha são obrigatórios.');
      return res.render('layout', { 
        title: 'Login',
        body: 'pages/login',
        error: 'Email e senha são obrigatórios.',
        user: req.session.user || null,
      });
    }

    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        console.error('Utilizador não encontrado.');
        return res.render('layout', { 
          title: 'Login',
          body: 'pages/login',
          error: 'Utilizador não encontrado.',
          user: req.session.user || null,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.error('Senha incorreta');
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
      console.error('Erro ao fazer login:', error);
      res.status(500).send('Erro interno.');
    }
  },

  logout: (req, res) => {
    req.session.destroy(() => {
      res.redirect('/');
    });
  },

  // Recuperação de senha
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.render('layout', { 
        title: 'Esqueci minha senha',
        body: 'pages/forgot',
        error: 'O email é obrigatório.' 
      });
    }

    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        return res.render('layout', { 
          title: 'Esqueci minha senha',
          body: 'pages/forgot',
          error: 'Usuário não encontrado.' 
        });
      }

      // Aqui você pode enviar um email com um link de redefinição de senha
      // Este exemplo apenas simula esse envio
      console.log(`Simulação: Link de recuperação enviado para ${email}.`);

      res.render('layout', { 
        title: 'Esqueci minha senha',
        body: 'pages/forgot',
        error: 'Um link de recuperação foi enviado para o seu email.' 
      });
    } catch (error) {
      console.error('Erro ao processar recuperação de senha:', error);
      res.status(500).send('Erro interno do servidor.');
    }
  },

  // Troca de senha
  changePassword: async (req, res) => {
    const { email, password, password2 } = req.body;

    if (!email || !password || !password2) {
      return res.render('layout', { 
        title: 'Troca de Password',
        body: 'pages/change_password',
        error: 'Todos os campos são obrigatórios.',
        email: email 
      });
    }

    if (password !== password2) {
      return res.render('layout', { 
        title: 'Troca de Password',
        body: 'pages/change_password',
        error: 'As senhas não coincidem.',
        email: email 
      });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await userModel.updatePassword(email, hashedPassword);

      if (result.affectedRows === 0) {
        return res.render('layout', { 
          title: 'Troca de Password',
          body: 'pages/change_password',
          error: 'Não foi possível alterar a senha.',
          email: email 
        });
      }

      res.render('layout', { 
        title: 'Login',
        body: 'pages/login',
        error: 'Senha alterada com sucesso. Faça login com sua nova senha.',
        email: email 
      });
    } catch (error) {
      console.error('Erro ao trocar senha:', error);
      res.status(500).send('Erro interno do servidor.');
    }
  },
};
