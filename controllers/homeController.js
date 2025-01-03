module.exports = {
    // Controlador para a página inicial
    homePage: (req, res) => {
      res.render('layout', { 
        title: 'Página Inicial', 
        body: 'pages/index',
        error: '', // Caso queira mostrar alguma mensagem de erro ou status
        user: req.session.user || null, // Dados do usuário logado
      });
    },
  
    // Controlador para a página "Sobre"
    aboutPage: (req, res) => {
      res.render('layout', { 
        title: 'Sobre', 
        body: 'pages/about',
        error: '', // Pode ser usado para exibir mensagens adicionais
        user: req.session.user || null,
      });
    },

    adminPage: (req, res) => {
      res.render('layout', { 
        title: 'Página de Administração', 
        body: 'pages/admin',
        error: '', // Caso queira mostrar alguma mensagem de erro ou status
        user: req.session.user || null, // Dados do usuário logado
      });
    },
  };
  