import { Router } from 'express';
import Product from '../dao/models/products.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import multer from 'multer';
import path from 'path';
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

router.get('/:pid', isAdmin, async (req, res) => {
  const user = getUserFromToken(req);
  try {
    const productId = req.params.pid;
    const producto = await Product.findById(productId).lean();
    if (producto) {
      res.status(200).render('productseditbyid', { producto, user });
    } else {
      res.status(404).render('error/product-not-found');
    }
  } catch (error) {
    res.status(500).render('error/under-maintenance');
  }
});

router.post('/:id', upload.single('thumbnails'), async (req, res) => {
  try {
    const productId = req.params.id;
    const { title, category, description, price, status, code, stock } =
      req.body;
    const updatedProduct = await Product.findByIdAndUpdate(productId, {
      title: title,
      category: category,
      description: description,
      price: price,
      status: status,
      code: code,
      stock: stock,
      ...(req.file ? { thumbnails: `/img/${req.file.filename}` } : {}),
    });

    res.redirect(`/productseditbyid/${productId}`);
  } catch (error) {
    res.status(500).render('error/under-maintenance');
  }
});

export default router;
