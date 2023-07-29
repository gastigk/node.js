import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import config from '../config/config.js';

const router = Router();

const secret = config.jwt.key;
const cookieName = config.jwt.cookiename;

// Middleware cookie-parser
router.use(cookieParser());

router.get('/', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: 'login' }),
  async (req, res) => {
    try {
      const token = jwt.sign({ user: req.user }, secret);

      // configuration cookie with JWT token
      res.cookie(cookieName, token, {
        httpOnly: true,
        secure: true,
      });

      res.redirect('/');
    } catch (err) {
      res.redirect('login');
    }
  }
);

export default router;
