const express = require('express');

const ProductsService = require('./../services/product.service');
const validatorHandler = require('./../middlewares/validator.handler');
const {
  createProductSchema,
  updateProductSchema,
  getProductSchema,
} = require('./../schemas/product.schema');

const router = express.Router();
const service = new ProductsService();

// listado de productos con límite
router.get('/', async (req, res) => {
  const limit = +req.query.limit;
  const products = await service.get();
  if (isNaN(limit)) {
    res.status(200).json(products);
  } else {
    res.status(200).json(products.slice(0, limit));
  }
});

// búsqueda por pid
router.get(
  '/:pid',
  validatorHandler(getProductSchema, 'params'),
  async (req, res, next) => {
    try {
      const { pid } = req.params;
      const product = await service.getById(pid);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// agregar nuevo producto
router.post(
  '/',
  validatorHandler(createProductSchema, 'body'),
  async (req, res) => {
    const body = req.body;
    const newProduct = await service.create(body);
    res.status(201).json(newProduct);
  }
);

// actualizar datos
router.put(
  '/:id',
  validatorHandler(getProductSchema, 'params'),
  validatorHandler(updateProductSchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const product = await service.update(id, body);
      res.json(product);
    } catch (error) {
      next(error);
    }
  }
);

// eliminar producto
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;
  const rta = await service.delete(pid);
  res.json(rta);
});

module.exports = router;
