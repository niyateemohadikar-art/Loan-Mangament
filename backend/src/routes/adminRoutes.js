const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboardStats);
router.get('/users', authenticate, authorize('admin'), adminController.getAllUsers);
router.put('/users/:id', authenticate, authorize('admin'), adminController.updateUserRole);
router.get('/defaulters', authenticate, authorize('admin', 'loan_officer'), adminController.getDefaulters);

// Notifications (all roles)
router.get('/notifications', authenticate, adminController.getNotifications);
router.put('/notifications/:id/read', authenticate, adminController.markNotificationRead);
router.put('/notifications/read-all', authenticate, adminController.markAllNotificationsRead);

module.exports = router;
