const db = require('./db');

module.exports = {
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM user WHERE email = ?', [email], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },
  updatePassword: (email, hashedPassword) => {
    return new Promise((resolve, reject) => {
      db.query('UPDATE user SET password = ? WHERE email = ?', [hashedPassword, email], (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },
  // Outros métodos (ex.: criar, deletar)
};
