const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { email, password, name, number } = req.body;
    // Create the user
    const user = await User.create({ email, password, name, number });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    // Check if user exists AND compare password
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate Token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ 
      message: "Login successful",
      token: token 
    });
  } catch (err) {
    res.status(500).json({ error: "Server error during login" });
  }
};