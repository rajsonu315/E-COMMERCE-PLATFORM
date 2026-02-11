const express = require('express');
const NotificationController = require('../controllers/NotificationController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);

// User endpoints
router.get('/', NotificationController.getMyNotifications);

// System/Admin endpoints (protected by same auth for now)
router.post('/send', NotificationController.sendNotification);

module.exports = router;
