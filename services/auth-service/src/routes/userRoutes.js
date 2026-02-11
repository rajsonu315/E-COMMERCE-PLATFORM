const express = require('express');
const UserController = require('../controllers/UserController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);

router.get('/', authController.restrictTo('user:read'), UserController.getAllUsers);
router.patch('/:id/block', authController.restrictTo('user:block'), UserController.blockUser);
router.patch('/:id/unblock', authController.restrictTo('user:block'), UserController.unblockUser);

module.exports = router;
