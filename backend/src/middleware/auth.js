const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Helper to check if DB is connected
const isDbConnected = async () => {
  try {
    await pool.query('SELECT 1');
    return true;
  } catch (err) {
    return false;
  }
};

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies?.token;
    
    if (!token) {
      return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    const dbActive = await isDbConnected();
    
    if (!dbActive) {
      // DEMO MODE: Trust the token data since DB is down
      console.log('🚧 Demo Mode: Bypassing user lookup in database.');
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        is_active: true
      };
      return next();
    }

    const result = await pool.query('SELECT id, name, email, role, is_active FROM users WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (!result.rows[0].is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired. Please login again.' });
    }
    return res.status(401).json({ success: false, message: 'Invalid token.' });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. ${req.user.role} role does not have permission.` 
      });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
