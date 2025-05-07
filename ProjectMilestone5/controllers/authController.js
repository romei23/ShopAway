const bcrypt = require('bcrypt');
const {db} = require('../db/db');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    // Store full session info
    req.session.userId = user.id;
    req.session.userType = user.user_type;
    req.session.name = user.name;
    req.session.email = user.email;

    res.json({
      message: "Login successful",
      userType: user.user_type,
      name: user.name,
      email: user.email
    });
  });
};


exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ message: "Logged out" });
};

exports.getSession = (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });

  res.json({
    userId: req.session.userId,
    userType: req.session.userType,
    name: req.session.name,        
    email: req.session.email       
  });
};



exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    console.log("📥 Received registration:", { name, email, password }); // log incoming data
  
    if (!name || !email || !password) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Missing required fields" });
    }
  
    try {
      const hashed = await bcrypt.hash(password, 10);
      const now = new Date().toISOString();
  
      db.run(
        `INSERT INTO users (created_at, updated_at, name, email, password, user_type)
         VALUES (?, ?, ?, ?, ?, 'shopper')`,
        [now, now, name, email, hashed],
        function (err) {
          if (err) {
            console.error("Registration error:", err.message); // log actual SQL error
            return res.status(500).json({ error: err.message });   
          }
          console.log("User registered:", email);
          res.json({ message: "User created" });
        }
      );
    } catch (err) {
      console.error("Bcrypt error:", err.message);
      res.status(500).json({ error: "Internal error" });
    }
  };


  
