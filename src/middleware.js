const { verifyToken } = require('./jsonwebtoken');

function authenticate(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Get token from "Bearer token"

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  req.userId = decoded.userId;
  next();
}

module.exports = { authenticate };
