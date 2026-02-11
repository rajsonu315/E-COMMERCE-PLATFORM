const ProductService = require('../services/ProductService');

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await ProductService.getAllProducts();
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: { products }
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await ProductService.getProduct(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await ProductService.createProduct(req.body);
    res.status(201).json({
      status: 'success',
      data: { product }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await ProductService.updateProduct(req.params.id, req.body);
    res.status(200).json({
      status: 'success',
      data: { product }
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};
