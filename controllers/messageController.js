const messageModel = require('../models/messageModel');

module.exports = {
    insertMessage: async (req, res) => {
        
        const { email, mensagem } = req.body;
    
        try {
          await messageModel.insertMessage(email, mensagem);
          res.redirect('/');
        } catch (error) {
          console.error('Erro ao inserir mensagem', error);
          res.status(500).send('Erro ao inserir mensagem.');
        }
    },
    getMessages: async (req, res) => {
        try {
          const messages = await messageModel.getMessages();
          res.render('layout', { 
            title: 'Lista Mensagens',
            body: 'pages/admin',
            error: '',
            messages: messages
          });
        } catch (error) {
          console.error('Erro ao buscar mensagens:', error);
          res.render('layout', { 
            title: 'Mensagens',
            body: 'pages/admin',
            error: 'Erro ao carregar mensagens.',
            messages: []
          });
        }
    }
}