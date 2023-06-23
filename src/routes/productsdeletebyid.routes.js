import { Router } from 'express';
import Product from '../dao/models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/:id', isAdmin, async (req, res) => {
  const user = getUserFromToken(req)
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndRemove(productId).lean();

    if (product) {
      res.render('productsdeletebyid', { product, user });
    } else {
      res.status(404).render('error/product-not-found');
    }
  } catch (error) {
    res.status(500).render('error/under-maintenance');
  }
});

export default router;
