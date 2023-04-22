const express = require('express');
const CartsService = require('./../services/carts.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createCartsSchema,
  getCartsSchema,
  postProductsSchema,
} = require('./../schemas/carts.schema');

const router = express.Router();
const service = new CartsService();

// listado de productos con límite
router.get('/', async (req, res) => {
  const limit = +req.query.limit;
  const carts = await service.get();
  if (isNaN(limit)) {
    res.status(200).json(carts);
  } else {
    res.status(200).json(carts.slice(0, limit));
  }
});

// búsqueda por cid
router.get(
  '/:cid',
  validatorHandler(getCartsSchema, 'params'),
  async (req, res, next) => {
    try {
      const { cid } = req.params;
      const cart = await service.getById(cid);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

// agregar nuevo cart
router.post(
  '/',
  validatorHandler(createCartsSchema, 'body'),
  async (req, res) => {
    const body = req.body;
    const newCart = await service.create(body);
    res.status(201).json(newCart);
  }
);

// agregar producto al [products]
router.post(
  '/:cid',
  validatorHandler(postProductsSchema, 'params'),
  async (req, res, next) => {
    try {
      const cid = Number(req.params.cid);
      const cart = await service.update(cid);
      res.json(cart);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
