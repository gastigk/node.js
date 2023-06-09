import { Router } from 'express';
import Product from '../dao/models/products.model.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/', async (req, res) => {
  const products = await Product.find().lean();    
  try {
      const user = getUserFromToken(req); 
      if (user.role !== 'admin') {
          return res.status(403).render('error/not-authorized');
      }
      res.status(200).render('admin-panel', { products, user });        
  } catch (error) {
      return res.status(403).render('error/not-authorized');
  }
});

export default router;
