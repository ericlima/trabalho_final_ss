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

const authController = require('./controllers/authController');

app.use(session({
  secret: process.env.SESSION_SECRET || 'default_secret', // Adicionado fallback para evitar problemas
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60, // 1 hora
    httpOnly: true, // Proteção contra XSS
    secure: process.env.NODE_ENV === 'production', // Somente HTTPS em produção
  },
}));

// Log para verificar inicialização
app.use((req, res, next) => {
  console.log(`Request recebido: ${req.method} ${req.url}`);
  next();
});

app.get('/about', (req, res) => {
  res.render('layout', {
    title: 'Sobre',
    body: 'pages/about',
    user: req.session.user || null,
  });
});

// Rota principal
app.get('/', (req, res) => {
  res.render('layout', {
    title: 'Página Inicial',
    body: 'pages/index',
    error: null,
    user: req.session.user || null,
  });
});

// Rotas de autenticação
app.get('/login', (req, res) => {
  res.render('layout', {
    title: 'Login',
    body: 'pages/login',
    error: null,
    user: req.session.user || null,
  });
});

// Rota admin com verificação de role
app.get('/admin', (req, res) => {
  const user = req.session.user;
  if (!user || user.role !== 'admin') {
    return res.status(403).render('layout', {
      title: 'Acesso Negado',
      body: 'pages/index',
      error: 'Você não tem permissão para acessar página administrativa.',
      user: user || null,
    });
  }

  res.render('layout', {
    title: 'Administração',
    body: 'pages/admin',
    user,
  });
});

app.post('/login', authController.login);

app.get('/logout', authController.logout);

app.get('/forgot', (req, res) => {
  res.render('layout', {
    title: 'Esqueceu a Senha',
    body: 'pages/forgot',
    error: null,
    user: req.session.user || null,
  });
});

app.post('/forgot', authController.forgotPassword);

// Testar rota básica
app.get('/health', (req, res) => {
  res.send('Aplicação está funcionando.');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
