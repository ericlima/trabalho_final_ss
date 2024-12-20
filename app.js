const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'aluno',
  password: 'aluno123',
  database: 'aluno',
});

const app = express();
const PORT = 3000;

// Configurar o motor de templates
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => {
  res.render('layout', { 
    title: 'Página Inicial', 
    body: '<%- include("pages/index") %>' 
  });
});

app.get('/login', (req, res) => {
  res.render('layout', { 
    title: 'login',
    body: ' include("pages/login") '
  });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'Sobre' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Consulta ao banco de dados
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.render('login', { error: 'Usuário não encontrado.' });
    }

    const user = results[0];

    // Verificação da senha
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch) {
        return res.render('login', { error: 'Senha incorreta.' });
      }

      // Login bem-sucedido
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      res.redirect('/');
    });
  });
})

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
