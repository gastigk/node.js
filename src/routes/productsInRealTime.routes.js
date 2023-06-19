import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../dao/models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import jwt from 'jsonwebtoken';

const router = Router();

// read environment variables
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cokieName = process.env.JWT_COOKIE_NAME;

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

router.get('/', isAdmin, (req, res) => {
  const userToken = req.cookies[cokieName];
  const decodedToken = jwt.verify(userToken, secret);
  const user = decodedToken;

  res.render('realtimeproducts', { user });
});

router.post('/', upload.single('thumbnail'), async (req, res) => {
  const { title, category, size, code, description, price, stock } = req.body;
  if (!title) {
    return res.status(400).send('complete title please');
  }

  const newProduct = new Product({
    title,
    category,
    size,
    status: true,
    code,
    description,
    price: parseInt(price),
    stock,
    thumbnail: `/img/${req.file.filename}`,
  });

  try {
    await newProduct.save();
    const product = await Product.find().lean();
    res.render('realtimeproducts', { product: product });
  } catch (err) {
    res.status(500).render('error/under-maintenance');
  }
});

export default router;
