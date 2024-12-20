const bcrypt = require('bcryptjs');

// Gera um hash para a senha (executar em um script separado)
const password = "aluno123";
bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  console.log(hash); // Insira este hash no banco
});
