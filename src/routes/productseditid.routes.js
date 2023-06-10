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

router.get('/:pid', isAdmin, async (req, res) => {
  const productId = req.params.pid;
  const userToken = req.cookies[cokieName];
  const decodedToken = jwt.verify(userToken, secret);
  const user = decodedToken;
  try {
    const producto = await Product.findById(productId).lean();
    if (producto) {
      res.render('productsedit', { producto, user });
    } else {
      res.status(404).send('product no found');
    }
  } catch (error) {
    res.status(500).send('UPS! we have a problem');
  }
});

export default router;
