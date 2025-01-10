const db = require('./db');

module.exports = {
    insertMessage: (email, message) => {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO Message (email, message) values (?,?)', [email, message], (err, result) => {
              if (err) {
                console.error('Erro ao inserir na tabela de mensagem:', err.message);
                return reject(new Error('Erro ao inserir na tabela de mensagem'));
              }
              resolve(result);
            });
          });
    },
    getMessages: () => {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM Message', (err, results) => {
              if (err) {
                console.error('Erro ao buscar mensagens:', err.message);
                return reject(new Error('Erro ao buscar mensagens.'));
              }
              resolve(results);
            });
          });
    }
}