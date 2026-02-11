const express = require('express');
const OrderController = require('../controllers/OrderController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);

router.post('/', OrderController.createOrder);
router.get('/', OrderController.getOrders);
router.get('/:id', OrderController.getOrder);

module.exports = router;
