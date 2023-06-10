import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

const router = Router();

import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

// Middleware cookie-parser
router.use(cookieParser());

router.get('/', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/githubcallback',
  passport.authenticate('github', { failureRedirect: '/login' }),
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
      res.redirect('/login');
    }
  }
);

export default router;
