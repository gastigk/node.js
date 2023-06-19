import passport from 'passport';
import { Router } from 'express';
import jwt from 'jsonwebtoken';

const router = Router();

// read environment variables
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

router.get('/', (req, res) => {
  const userToken = req.cookies[cookieName];
  const decodedToken = jwt.verify(userToken, secret);
  const user = decodedToken;
  res.render('signupadmin', { user });
});

router.post('/', (req, res, next) => {
  passport.authenticate('signup', (err, user, info) => {
    if (err) {
      return res.status(500).render('error/under-maintenance');
    }

    if (!user) {
      if (info.message === 'Email already exists.') {
        return res.redirect('error/user-exists');
      } else if (info.message === 'Phone already exists.') {
        return res.render('error/phone-exists');
      }
    }

    req.login(user, (err) => {
      if (err) {
        return res.status(500).render('error/under-maintenance');
      }

      res.redirect('/users');
    });
  })(req, res, next);
});

export default router;
