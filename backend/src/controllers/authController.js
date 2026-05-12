const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
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

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const dbActive = await isDbConnected();

    if (!dbActive) {
      // DEMO MODE fallback
      console.log('🚧 Database not connected. Using Demo Mode for registration.');
      const mockUser = {
        id: Math.floor(Math.random() * 10000),
        name,
        email,
        role: 'borrower',
        created_at: new Date()
      };
      const token = generateToken(mockUser);
      return res.status(201).json({
        success: true,
        message: 'Registration successful! (Demo Mode)',
        data: { user: mockUser, token }
      });
    }

    // Check if user exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Only allow 'borrower' role for self-registration
    const userRole = 'borrower';

    const result = await pool.query(
      `INSERT INTO users (name, email, password, phone, role) 
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, phone || null, userRole]
    );

    const user = result.rows[0];
    const token = generateToken(user);

    // Create welcome notification (swallow error if it fails)
    try {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type) VALUES ($1, $2, $3, $4)`,
        [user.id, 'Welcome! 🎉', 'Welcome to Smart Loan Management System.', 'general']
      );
    } catch (e) {}

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: { user, token }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration. Please check DB connection.' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const dbActive = await isDbConnected();

    if (!dbActive) {
      // DEMO MODE fallback
      console.log('🚧 Database not connected. Using Demo Mode for login.');
      // Special demo accounts
      let role = 'borrower';
      let name = 'Demo User';
      if (email.includes('admin')) { role = 'admin'; name = 'Admin User'; }
      else if (email.includes('officer')) { role = 'loan_officer'; name = 'Loan Officer'; }

      const mockUser = { id: 999, name, email, role, is_active: true };
      const token = generateToken(mockUser);
      
      return res.json({
        success: true,
        message: 'Login successful! (Demo Mode)',
        data: { user: mockUser, token }
      });
    }

    const result = await pool.query(
      'SELECT id, name, email, password, role, is_active FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    if (!user.is_active) {
      return res.status(403).json({ success: false, message: 'Account is deactivated.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = generateToken(user);
    const { password: _, ...userData } = user;

    res.json({
      success: true,
      message: 'Login successful!',
      data: { user: userData, token }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const dbActive = await isDbConnected();
    if (!dbActive) {
       return res.json({ success: true, data: { id: req.user.id, name: 'Demo User', email: req.user.email, role: req.user.role } });
    }
    const result = await pool.query('SELECT id, name, email, role, phone FROM users WHERE id = $1', [req.user.id]);
    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

exports.updateProfile = async (req, res) => {
  res.json({ success: true, message: 'Profile updated! (Demo Mode)' });
};

exports.forgotPassword = async (req, res) => {
  res.json({ success: true, message: 'Reset link sent! (Demo Mode)' });
};

exports.resetPassword = async (req, res) => {
  res.json({ success: true, message: 'Password reset successful! (Demo Mode)' });
};
