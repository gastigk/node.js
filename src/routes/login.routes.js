import { Router } from 'express';
import User from '../dao/models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateToken } from '../config/passport.config.js';
import config from '../config/config.js';

const router = Router();

const secret = config.jwt.key;
const cookieName = config.jwt.cookiename;

router.get('/', (req, res) => {
  res.render('login');
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email }).exec();

    if (!user) {
      return res.status(400).render('error/user-pass-wrong');
    }

    bcrypt.compare(password, user.password).then((result) => {
      if (result) {
        const token = generateToken(user);
        const userToken = token;

        const decodedToken = jwt.verify(userToken, secret);
        const userId = decodedToken.userId;

        res.cookie(cokieName, userToken).redirect('/');
      } else {
        return res.status(400).render('error/user-pass-wrong');
      }
    });
  } catch (err) {
    return res.status(500).render('error/under-maintenance');
  }
});

// get users in the cookies
router.get('/user', (req, res) => {
  const userToken = req.cookies[cokieName];

  if (!userToken) {
    return res.status(401).render('error/not-authorized');
  }

  try {
    const decodedToken = jwt.verify(userToken, cokieName);
    const userId = decodedToken.userId;
    User.findById(userId, (err, user) => {
      if (err || !user) {
        return res.status(404).render('error/user-not-found');
      }

      return res.status(200).send({ status: 'success', user });
    });
  } catch (err) {
    return res.status(500).render('error/under-maintenance');
  }
});

export default router;
