const express = require('express');

const productsRouter = require('./products.router');
const cartsRouter = require('./carts.router');
const mainRouter = require('./main.router');
const cartRouter = require('./cart.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api', router);
  router.use('/', mainRouter);
  router.use('/products', productsRouter);
  router.use('/carts', cartsRouter);
  router.use('/cart', cartsRouter);
}

module.exports = routerApi;
