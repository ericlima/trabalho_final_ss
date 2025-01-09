const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurações de middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hora
    httpOnly: true, // Proteção contra XSS
    secure: process.env.NODE_ENV === 'production', // Somente HTTPS em produção
  },
}));

// Configurar EJS como motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === authController.js ===
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
      console.error('Erro ao fazer login: Email inválido.');
      return res.render('layout', {
        title: 'Login',
        body: 'pages/login',
        error: 'Credenciais inválidas.',
        user: req.session.user || null,
      });
    }

    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        console.error('Erro ao fazer login: Utilizador não encontrado.');
        return res.render('layout', {
          title: 'Login',
          body: 'pages/login',
          error: 'Credenciais inválidas.',
          user: req.session.user || null,
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.error('Erro ao fazer login: Senha incorreta.');
        return res.render('layout', {
          title: 'Login',
          body: 'pages/login',
          error: 'Credenciais inválidas.',
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
      res.redirect('/');
    });
  },
};
