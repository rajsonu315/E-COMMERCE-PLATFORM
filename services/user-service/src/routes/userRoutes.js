const express = require('express');
const UserController = require('../controllers/UserController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);

router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);

router.get('/addresses', UserController.getAddresses);
router.post('/addresses', UserController.addAddress);
router.delete('/addresses/:id', UserController.deleteAddress);

module.exports = router;
