import { Router } from 'express';
import Product from '../dao/models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import Handlebars from 'handlebars';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/', isAdmin, async (req, res) => {
  const user = getUserFromToken(req);
  const sortOption = req.query.sortOption;
  let sortQuery = {};
  if (sortOption === 'desc') {
    sortQuery = { price: -1 };
  } else {
    sortQuery = { price: 1 };
  }

  if (sortOption === 'unorder') {
    return res.redirect('/products');
  }

  try {
    const products = await Product.find().sort(sortQuery).lean();
    res.render('/productstable', { products, user });
  } catch (error) {
    res.status(500).render('error/under-maintenance');
  }
});

Handlebars.registerHelper('ifEqual', function (a, b, options) {
  if (a === b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

export default router;
