const express = require('express');
const PaymentController = require('../controllers/PaymentController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);

router.post('/', PaymentController.processPayment);

module.exports = router;
