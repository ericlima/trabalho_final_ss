const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

// Importar arquivos de rotas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const homeRoutes = require('./routes/homeRoutes');

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
  cookie: { maxAge: 1000 * 60 * 60 }, // 1 hora
}));

// Configurar EJS como motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Adicionar rotas
app.use(authRoutes); // Rotas de autenticação
app.use('/users', userRoutes); // Rotas de usuários
app.use('/', homeRoutes); // Rotas gerais (home, sobre)

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
