const pool = require('../config/database');

const isDbConnected = async () => {
  try { await pool.query('SELECT 1'); return true; } catch (err) { return false; }
};

exports.getDashboardStats = async (req, res) => {
  res.json({
    success: true,
    data: {
      users: [{ total: 10 }],
      loanStats: [{ status: 'approved', count: 5, total_amount: 2500000 }],
      totalDisbursed: 2500000,
      defaulterCount: 1,
      loanTypeDistribution: [{ loan_type: 'personal', count: 3 }, { loan_type: 'vehicle', count: 2 }],
      recentLoans: []
    }
  });
};

exports.getAllUsers = async (req, res) => { res.json({ success: true, data: [] }); };
exports.updateUserRole = async (req, res) => { res.json({ success: true, message: 'Updated' }); };
exports.getDefaulters = async (req, res) => { res.json({ success: true, data: [] }); };
exports.getNotifications = async (req, res) => { res.json({ success: true, data: [] }); };
exports.markNotificationRead = async (req, res) => { res.json({ success: true }); };
exports.markAllNotificationsRead = async (req, res) => { res.json({ success: true }); };
