import passport from 'passport';
import { Router } from 'express';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

router.get('/', (req, res) => {
  const user = getUserFromToken(req);
  res.render('signupadmin', { user });
});

router.post('/', (req, res, next) => {
  passport.authenticate('signupadmin', (err, user, info) => {
    if (err) {
      return res.status(500).render('error/under-maintenance');
    }

    if (!user) {
      if (info.message === 'e-mail already exists.') {
        return res.redirect('error/user-exists');
      } else if (info.message === 'phone already exists.') {
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
