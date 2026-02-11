const express = require('express');
const ProductController = require('../controllers/ProductController');
const authController = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .get(ProductController.getAllProducts)
  .post(
    authController.protect, 
    authController.restrictTo('product:create'), 
    ProductController.createProduct
  );

router.route('/:id')
  .get(ProductController.getProduct)
  .put(
    authController.protect,
    authController.restrictTo('product:update'),
    ProductController.updateProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo('product:delete'),
    ProductController.deleteProduct
  );

module.exports = router;
