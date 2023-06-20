import multer from 'multer';
import path from 'path';
import Product from '../dao/models/products.model.js';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// read environment variables
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

router.get('/', async (req, res, next) => {
  try {
    const userToken = req.cookies[cookieName];

    let user = null;
    if (userToken) {
      const decodedToken = jwt.verify(userToken, secret);
      user = decodedToken;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const category = req.query.category;
    const filter = category ? { category } : {};

    const result = await Product.aggregate([
      { $match: filter },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    const products = result;
    const prevLink = page > 1 ? `/products?page=${page - 1}` : '';
    const nextLink = products.length === limit ? `/products?page=${page + 1}` : '';

    const count = await Product.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.min(page, totalPages);

    const allCategories = await Product.distinct('category');

    res.render('products', {
      products,
      prevLink,
      nextLink,
      user,
      currentPage,
      allCategories
    });
  } catch (err) {
    next(err);
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'public', 'img'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = file.fieldname + '-' + Date.now() + ext;
    cb(null, filename);
  },
});
const upload = multer({ storage });

router.post('/', upload.single('thumbnail'), async (req, res) => {
  const { title, category, description, price, code, stock } = req.body;
  if (!title) {
    return res.status(400).send('complete the title please');
  }

  const newProduct = new Product({
    title,
    category,
    description,
    price: parseInt(price),
    status: true,
    code,
    stock,
    thumbnail: `/img/${req.file.filename}`,
  });

  try {
    await newProduct.save();

    const page = 1;
    const limit = 9;

    const result = await Product.paginate({}, { page, limit, lean: true });

    const products = result.docs;
    const prevLink = result.hasPrevPage
      ? `/products?page=${result.prevPage}`
      : '';
    const nextLink = result.hasNextPage
      ? `/products?page=${result.nextPage}`
      : '';

      res.render('products', {
        products,
        page,
        prevLink,
        nextLink,
        user,
      });
  } catch (err) {
    res.status(500).render('error/under-maintenance');
  }
});

router.get('/filter/:category', async (req, res, next) => {
  try {
    const userToken = req.cookies[cookieName];

    let user = null;
    if (userToken) {
      const decodedToken = jwt.verify(userToken, secret);
      user = decodedToken;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const category = req.params.category;
    const filter = category ? { category } : {};

    const count = await Product.countDocuments(filter);
    const totalPages = Math.ceil(count / limit);
    const currentPage = Math.min(page, totalPages);

    const result = await Product.aggregate([
      { $match: filter },
      { $skip: (currentPage - 1) * limit },
      { $limit: limit },
    ]);

    const products = result;
    const prevLink = `/products/filter/${category}?page=${currentPage - 1}`;
    const nextLink = `/products/filter/${category}?page=${currentPage + 1}`;

    const allProducts = await Product.find({}).distinct('category');
    res.render('products', {
      products,
      prevLink,
      nextLink,
      allProducts,
      currentPage,
      totalPages,
      user,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
