import { Router } from 'express';
import Product from '../dao/models/products.model.js';
import Cart from '../dao/models/carts.model.js';
import Handlebars from 'handlebars';
import mongoose from 'mongoose';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import config from '../config/config.js'

const router = Router();

const cookieName = config.jwt.cookiename;

let user = null;
let userEmail = null;

Handlebars.registerHelper('reduce', function (array, prop) {
  return array.reduce((acc, item) => acc + item[prop], 0);
});
Handlebars.registerHelper('multiply', function (a, b) {
  return a * b;
});
Handlebars.noEscape = true;

async function getOrCreateCart(userEmail = null) {
  if (userEmail) {
    const cart = await Cart.findOne({ 'user.email': userEmail }).exec();
    if (cart) {
      return cart;
    } else {
      const newCart = new Cart({ user: { email: userEmail }, items: [] });
      return newCart.save();
    }
  } else {
    const cart = await Cart.findOne({ 'user.email': null }).exec();
    if (cart) {
      return cart;
    } else {
      const newCart = new Cart({ items: [] });
      return newCart.save();
    }
  }
}

// Show the cart
router.get('/', async (req, res) => {
  user = getUserFromToken(req);
  try {
    const { sortOption } = req.query;
    const userToken = req.cookies[cokieName];

    if (userToken) {
      userEmail = user.email || user.user.email;
    } else {
      return res.render('login');
    }

    let cart;
    if (userEmail) {
      cart = await getOrCreateCart(userEmail);
    } else {
      cart = await getOrCreateCart();
    }

    if (!cart || cart.items.length === 0 || (!userEmail && cart.user.email)) {
      return res.render('error/cart-not-found', { user });
    }
    const cartId = cart._id.toString();

    let sortedItems = [...cart.items];

    if (sortOption === 'asc') {
      sortedItems.sort((a, b) => a.producto.price - b.producto.price);
    } else if (sortOption === 'desc') {
      sortedItems.sort((a, b) => b.producto.price - a.producto.price);
    }

    const totalPriceAggregate = await Cart.aggregate([
      { $match: { _id: cart._id } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.producto',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$_id',
          totalPrice: {
            $sum: { $multiply: ['$product.price', '$items.cantidad'] },
          },
        },
      },
    ]);

    const totalPrice =
      totalPriceAggregate.length > 0 ? totalPriceAggregate[0].totalPrice : 0;

    res.render('carts', {
      cart: { ...cart, items: sortedItems },
      totalPrice,
      cartId,
      user,
    });
  } catch (err) {
    res.status(500).render('error/cart-not-found');
  }
});

// emptying shopping cart
router.post('/:cartId/void', async (req, res) => {
  const userToken = req.cookies[cokieName];

  if (userToken) {
    user = getUserFromToken(req);
    userEmail = user.email || user.user.email;
  }
  try {
    const cartId = req.params.cartId;
    const cart = await Cart.findOneAndUpdate(
      { _id: cartId, 'user.email': userEmail },
      { items: [] }
    );

    if (!cart) {
      req.flash('error', 'cart not found');
      return res.redirect('error/cart-not-found');
    }

    cart.items = [];
    await cart.save();
    req.flash('success', 'cart successfully emptied');
    res.redirect('/carts');
  } catch (err) {
    res.status(500).render('error/error-page');
  }
});

// deleted cart from DBA
router.post('/:cartId/delete', async (req, res) => {
  const userToken = req.cookies[cokieName];

  if (userToken) {
    user = getUserFromToken(req);
    userEmail = user.email || user.user.email;
  }

  try {
    const cartId = req.params.cartId;
    const result = await Cart.deleteOne({
      _id: cartId,
      'user.email': userEmail,
    });

    if (result.deletedCount === 0) {
      req.flash('error', 'cart not found');
      return res.redirect('/');
    }

    req.flash('success', 'cart successfully emptied');
    res.redirect('/carts');
  } catch (err) {
    res.status(500).render('error/error-page');
  }
});

// quantity update the product in cart
router.put('/:cartId/:itemId', async (req, res) => {
  const userToken = req.cookies[cokieName];

  if (userToken) {
    user = getUserFromToken(req);
    userEmail = user.email || user.user.email;
  }

  try {
    const cartId = req.params.cartId;
    const itemId = req.params.itemId;
    const { cantidad } = req.body;

    if (!mongoose.Types.ObjectId.isValid(cartId)) {
      req.flash('error', 'invalid cart id');
      return res.redirect('error/cart-not-found');
    }

    const cart = await Cart.findOneAndUpdate(
      { _id: cartId, 'user.email': userEmail, 'items._id': itemId },
      { $set: { 'items.$.cantidad': cantidad } },
      { new: true }
    );

    if (!cart) {
      return res.redirect('error/cart-not-found');
    }

    req.flash('success', 'quantity updated successfully');
    res.redirect('/carts');
  } catch (err) {
    res.status(500).render('error/error-page');
  }
});

// add products in cart
router.post('/:pid', async (req, res) => {
  try {
    const userToken = req.cookies[cokieName];

    if (userToken) {
      user = getUserFromToken(req);
      userEmail = user.email || user.user.email;
    }
    const { cantidad } = req.body;
    const productId = req.params.pid;
    const producto = await Product.findOne({ _id: productId });

    if (!userEmail) {
      req.flash('error', 'user not authenticated');
      res.status(500).redirect('error/user-not-found');
      return;
    }

    let cart = await getOrCreateCart(userEmail);
    cart.items.push({ producto: producto, cantidad: cantidad });
    cart.user.email = userEmail;
    await cart.save();
    res.redirect('/');
  } catch (err) {
    res.status(500).render('error/error-page');
  }
});

export default router;
