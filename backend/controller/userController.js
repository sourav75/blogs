const bcrypt = require('bcrypt');

// In-memory user store (for demo only)
const users = new Map();

exports.register = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password required.' });
  }
  if (users.has(username)) {
    return res.status(409).json({ message: 'Username already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  users.set(username, { username, password: hashedPassword });
  res.status(201).json({ message: 'User registered successfully.' });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.get(username);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }
  req.session.user = username;
  res.json({ message: 'Login successful.' });
};

exports.profile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  res.json({ message: `Welcome, ${req.session.user}!` });
};

exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed.' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out successfully.' });
  });
};
