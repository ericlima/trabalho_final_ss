const bcrypt = require('bcryptjs');

// Gera um hash para a senha (executar em um script separado)
const password = "aluno123";
let hashpassord = "";

bcrypt.hash(password, 10, (err, hash) => {
  if (err) throw err;
  hashpassord = hash;
});

setTimeout(() => {
  console.log(hashpassord); // Insira este hash no banco
}, 500);
