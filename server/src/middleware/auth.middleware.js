const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from the "Authorization" header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    // Verify token using the secret in .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; 
    next(); 
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};