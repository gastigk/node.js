import { Router } from 'express';
import config from '../config/config.js'

const router = Router();
const cookieName = config.jwt.cookiename;

router.get('/', async (req, res) => {
  res.clearCookie(cokieName);
  res.redirect('/');
});

export default router;
