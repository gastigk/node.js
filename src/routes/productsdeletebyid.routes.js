import { Router } from 'express';
import Product from '../dao/models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import jwt from 'jsonwebtoken';

const router = Router();

// read environment variables
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cokieName = process.env.JWT_COOKIE_NAME;

router.get('/:id', isAdmin, async (req, res) => {
  const userToken = req.cookies[cokieName];
  const decodedToken = jwt.verify(userToken, secret);
  const user = decodedToken;
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndRemove(productId).lean();

    if (product) {
      res.render('productsdeletebyid', { product, user });
    } else {
      res.sendStatus(404).send('product no found');
    }
  } catch (error) {
    res.sendStatus(500).send('UPS! we have a problem');
  }
});

export default router;
