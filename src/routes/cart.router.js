const express = require('express');
const CartsService = require('./../services/carts.service');

const router = express.Router();
const service = new CartsService();

// listado de carts con límite
router.get('/', async (req, res) => {
  const limit = +req.query.limit;
  const carts = await service.get();
  if (isNaN(limit)) {
    res.status(200).render('cart', { carts: products.slice(0, 4) });
  } else {
    res.status(200).render('cart', { carts: carts.slice(0, limit) });
  }
});

module.exports = router
