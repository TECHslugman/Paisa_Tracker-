const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Get token from the "Authorization" header
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <TOKEN>"

  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    // Verify token using the secret in your .env
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Attach user info to the request
    next(); // Move to the next function (the controller)
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};