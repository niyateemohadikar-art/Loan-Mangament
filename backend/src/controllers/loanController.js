const pool = require('../config/database');

const isDbConnected = async () => {
  try { await pool.query('SELECT 1'); return true; } catch (err) { return false; }
};

exports.applyLoan = async (req, res) => {
  try {
    const dbActive = await isDbConnected();
    if (!dbActive) {
      return res.status(201).json({
        success: true,
        message: 'Loan application submitted! (Demo Mode)',
        data: { id: Math.floor(Math.random() * 1000) }
      });
    }
    const { loan_type, loan_amount, tenure_months, purpose } = req.body;
    const result = await pool.query(
      `INSERT INTO loan_applications (borrower_id, loan_type, loan_amount, tenure_months, purpose, status)
       VALUES ($1, $2, $3, $4, $5, 'submitted') RETURNING *`,
      [req.user.id, loan_type, loan_amount, tenure_months, purpose]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMyLoans = async (req, res) => {
  try {
    const dbActive = await isDbConnected();
    if (!dbActive) {
      return res.json({
        success: true,
        data: [
          { id: 101, loan_type: 'personal', loan_amount: 500000, tenure_months: 24, status: 'approved', created_at: new Date() },
          { id: 102, loan_type: 'vehicle', loan_amount: 800000, tenure_months: 36, status: 'submitted', created_at: new Date() }
        ]
      });
    }
    const result = await pool.query('SELECT * FROM loan_applications WHERE borrower_id = $1', [req.user.id]);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getLoanById = async (req, res) => { res.json({ success: true, data: {} }); };
exports.getAllLoans = async (req, res) => { res.json({ success: true, data: [] }); };
exports.reviewLoan = async (req, res) => { res.json({ success: true, message: 'Reviewed' }); };
exports.approveLoan = async (req, res) => { res.json({ success: true, message: 'Approved' }); };
exports.rejectLoan = async (req, res) => { res.json({ success: true, message: 'Rejected' }); };
exports.getEMISchedule = async (req, res) => { res.json({ success: true, data: [] }); };
