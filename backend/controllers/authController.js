const User = require('../models/User');
const jwt  = require('jsonwebtoken');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

const register = async (req, res) => {
  console.log('Register body:', req.body);
  const { name, email, phone, password, role } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Already registered' });
    const user = await User.create({ name, email, phone, password, role });
    res.status(201).json({
      _id:   user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    console.log('Register error:', err.message);
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id:        user._id,
        name:       user.name,
        email:      user.email,
        role:       user.role,
        trustScore: user.trustScore,
        token:      generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };