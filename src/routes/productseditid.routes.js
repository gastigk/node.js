import { Router } from 'express';
import Product from '../dao/models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/:pid', isAdmin, async (req, res) => {
  const productId = req.params.pid;
  const user = getUserFromToken(req);
  try {
    const producto = await Product.findById(productId).lean();
    if (producto) {
      res.render('productsedit', { producto, user });
    } else {
      res.status(404).render('error/product-not-found');
    }
  } catch (error) {
    res.status(500).render('error/under-maintenance');
  }
});

export default router;
