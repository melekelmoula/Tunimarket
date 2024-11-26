// my-node-backend/middleware/index.js

const { authentication } = require('../config/firebaseConfig');

class Middleware {
  async decodeToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    try {
      const decodedValue = await authentication.verifyIdToken(token);
      if (decodedValue) {
        req.user = decodedValue; // Attach user data to the request
        return next();
      }
      return res.status(403).json({ message: 'Invalid token' });
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(403).json({ message: 'Failed to verify token' });
    }
  }
}

module.exports = new Middleware();
