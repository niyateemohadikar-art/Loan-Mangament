const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const { authenticate, authorize } = require('../middleware/auth');

// Borrower routes
router.post('/apply', authenticate, authorize('borrower'), loanController.applyLoan);
router.get('/my-loans', authenticate, authorize('borrower'), loanController.getMyLoans);
router.get('/emi/:loanId', authenticate, loanController.getEMISchedule);

// Officer routes
router.put('/:id/review', authenticate, authorize('loan_officer', 'admin'), loanController.reviewLoan);
router.put('/:id/approve', authenticate, authorize('loan_officer', 'admin'), loanController.approveLoan);
router.put('/:id/reject', authenticate, authorize('loan_officer', 'admin'), loanController.rejectLoan);

// Shared routes
router.get('/all', authenticate, authorize('loan_officer', 'admin'), loanController.getAllLoans);
router.get('/:id', authenticate, loanController.getLoanById);

module.exports = router;
