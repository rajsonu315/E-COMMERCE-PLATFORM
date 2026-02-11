const express = require('express');
const CartController = require('../controllers/CartController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authController.protect);

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.put('/items/:productId', CartController.updateItem);
router.delete('/items/:productId', CartController.removeItem);

module.exports = router;
