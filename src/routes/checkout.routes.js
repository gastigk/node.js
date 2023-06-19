import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  try {
    res.render('checkout');
  } catch (err) {
    res.status(500).render('error/under-maintenance');
  }
});

export default router;
