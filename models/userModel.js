const db = require('./db');

module.exports = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) {
          console.error('Erro ao buscar por e-mail:', err.message);
          return reject(new Error('Erro ao buscar utilizador.'));
        }
        resolve(results[0]);
      });
    });
  },
  updatePassword: (email, hashedPassword) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
        if (err) {
          console.error('Erro ao atualizar senha:', err.message);
          return reject(new Error('Erro ao atualizar senha.'));
        }
        resolve(result);
      });
    });
  },
};
