const express = require('express');

const ProductsService = require('../services/product.service');

const router = express.Router();
const service = new ProductsService();

// listado de productos con límite
router.get('/', async (req, res) => {
  const limit = +req.query.limit;
  const products = await service.get();
  if (isNaN(limit)) {
    res.status(200).render('index', { products: products.slice(0, 4) });
  } else {
    res.status(200).render('index', { products: products.slice(0, limit) });
  }
});

module.exports = router


