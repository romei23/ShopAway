const bcrypt = require('bcrypt');

bcrypt.hash('myadmin123', 10).then(hash => {
  console.log("🔐 Hashed password:", hash);
});
