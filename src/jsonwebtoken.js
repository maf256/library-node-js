const jwt = require('jsonwebtoken');

// Create a JWT
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Verify the token
function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // Invalid or expired token
  }
}

module.exports = { generateToken, verifyToken };
