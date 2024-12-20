const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Configurar o motor de templates
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurar arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.get('/', (req, res) => {
  res.render('index', { title: 'Página Inicial' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'Sobre' });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
