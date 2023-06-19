import { Router } from 'express';
import Cart from '../dao/models/carts.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const router = Router();

// read environment variables
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

router.get('/:cartId/:itemId', async (req, res) => {
  const userToken = req.cookies[cookieName];
  const decodedToken = jwt.verify(userToken, secret);
  const user = decodedToken;
  const { cartId, itemId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(cartId)) {
    return res.status(400).render('error/cart-not-found');
  }

  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).render('error/cart-not-found');
    }

    const itemIndex = cart.items.findIndex((item) => item._id.equals(itemId));
    if (itemIndex === -1) {
      return res.status(404).render('error/product-not-found');
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();
    return res.render('cartsDeleteById', { cartId, itemId, user });
  } catch (error) {
    return res.status(404).render('error/cart-not-found');
  }
});

export default router;
