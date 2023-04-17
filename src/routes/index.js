const express = require('express');

const productsRouter = require('./products.router');
const cartsRouter = require('./carts.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api', router);
  router.use('/products', productsRouter);
  router.use('/carts', cartsRouter);
}

module.exports = routerApi;
