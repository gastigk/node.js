import { Router } from 'express';
import Cart from '../dao/models/carts.model.js';
import mongoose from 'mongoose';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/:cartId/:itemId', async (req, res) => {
  const user = getUserFromToken(req);
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
    return res.render('cart-product-delete', { cartId, itemId, user });
  } catch (error) {
    return res.status(404).render('error/cart-not-found');
  }
});

export default router;
