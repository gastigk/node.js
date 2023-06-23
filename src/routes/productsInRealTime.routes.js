import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import Product from '../dao/models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

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
  const user = getUserFromToken(req);    
  res.render('realtimeproducts', { user });
});

router.post('/', upload.single('thumbnails'), async (req, res) => {
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
    thumbnails: `/img/${req.file.filename}`,
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
