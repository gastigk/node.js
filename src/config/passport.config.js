import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import User from '../dao/models/user.model.js';
import jwt from 'jsonwebtoken';

import config from '../config/config.js'

const secret = config.jwt.secret;

export const generateToken = (user) => {
  const payload = {
    userId: user._id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role: user.role,
  };

  const token = jwt.sign(payload, secret, {
    expiresIn: '24h',
  });

  return token;
};

export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).render('error/missing-auth'); // missing authorization token
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return res.status(403).render('error/not-authorized'); // invalid token
    }

    User.findById(decodedToken.userId)
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(404).render('error/user-not-found');
        }

        req.user = user;
        next();
      })
      .catch((err) => {
        return res.status(500).render('error/under-maintenance');
      });
  });
};

// configuration local strategy with Passport
passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const existingUser = await User.findOne({ email: email });
        const existingUserPhone = await User.findOne({ phone: req.body.phone });

        if (existingUser) {
          return done(null, false, { message: 'e-mail already exists.' });
        }
        if (existingUserPhone) {
          return done(null, false, { message: 'phone already exists.' });
        }

        const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
        const newUser = new User({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          email: email,
          phone: req.body.phone,
          age: req.body.age,
          role: req.body.role,
          password: hash,
        });

        await newUser.save();
        return done(null, newUser);
      } catch (err) {
        return done(err);
      }
    }
  )
);

//Middleware of Passport initialization
const initializePassport = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });

  return passport.initialize();
};

export default initializePassport;
