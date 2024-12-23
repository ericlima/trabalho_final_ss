const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');

process.on('uncaughtException', (err) => {
  console.error('Erro não tratado:', err.message);
  process.exit(1);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'aluno',
  password: 'aluno123',
  database: 'aluno',
});

db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
    throw new Error('Erro crítico!');
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

const app = express();
const PORT = 3000;

// Configurar o motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'minha-chave-secreta', // Substitua por uma string aleatória e segura
  resave: false, // Não salva a sessão novamente se não houver alterações
  saveUninitialized: false, // Não cria sessões para requisições que não a utilizam
  cookie: {
    maxAge: 1000 * 60 * 60, // Sessão expira após 1 hora
  }
}));

// Configurar arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Se não houver usuário, `user` será `null`
  next();
});

// Rotas
app.get('/', (req, res) => {
  res.render('layout', { 
    title: 'Página Inicial', 
    body: 'pages/index',
    error: ''
  });
});

app.get('/password', (req, res) => {
  res.render('layout', { 
    title: 'Troca de Password',
    body: 'pages/change_password',
    error: '',
    email: req.query.email
  });
});

app.post('/password', (req, res) => {
  const { email, password, password2 } = req.body;
  
  if (!email) {
    res.render('layout', { 
      title: 'Troca de Password',
      body: 'pages/change_password',
      error: 'o email não foi informado'
    });
    return;
  }

  if (!password || !password2) {
    res.render('layout', { 
      title: 'Troca de Password',
      body: 'pages/change_password',
      error: 'as senhas devem ser preenchidas'
    });
    return;
  }

  if (password != password2) {
    res.render('layout', { 
      title: 'Troca de Password',
      body: 'pages/change_password',
      error: 'as senhas devem ser iguais'
    });
    return;
  }

  bcrypt.hash(password, 10, (err, hash) => {

    db.query('UPDATE user SET password = ? WHERE email = ?', [hash, email], (err, result) => {
      
      if (err) {
        res.render('layout', { 
          title: 'Troca de Password',
          body: 'pages/change_password',
          error: err
        });
        return;
      }
      
      if (result.affectedRows > 0) {
        res.render('layout', { 
          title: 'Login',
          body: 'pages/login',
          error: 'password trocada com sucesso'
        });
        return;
      } else {
        res.render('layout', { 
          title: 'Troca de Password',
          body: 'pages/change_password',
          error: 'não foi possivel efetuar a alteração'
        });
        return;
      }
    });
  });
});

app.get('/login', (req, res) => {
  res.render('layout', { 
    title: 'login',
    body: 'pages/login',
    error: ''
  });
});

app.get('/forgot', (req, res) => {
  res.render('layout', { 
    title: 'Esqueci minha senha',
    body: 'pages/forgot',
    error: ''
  });
});

app.post('/forgot', (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.render('layout', { 
      title: 'Esqueci minha senha',
      body: 'pages/forgot',
      error: 'o email é obrigatório'
    });
    return;
  }

  res.redirect('/');
});

app.get('/about', (req, res) => {
  res.render('layout', { 
    title: 'Sobre',
    body: 'pages/about',
    error: ''
  });
});

app.get('/logout', (req, res) => {
  req.session.user = null;
  res.redirect('/');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email e password são obrigatórios.');
  }

  // Consulta ao banco de dados
  db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.render('layout', { 
        title: 'login',
        body: 'pages/login',
        error: 'Usuário não encontrado.'
      });   
      return;   
    }

    const user = results[0];

    // Verificação da senha
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (!isMatch) {
        res.render('layout', { 
          title: 'login',
          body: 'pages/login',
          error: 'Senha incorreta.'
        });
        return; 
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
