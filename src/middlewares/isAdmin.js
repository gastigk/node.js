// verfication if user is admin
import jwt from 'jsonwebtoken';
import config from '../config/config.js'

const secret = config.jwt.key;
const cookieName = config.jwt.cookiename;

const isAdmin = (req, res, next) => {
  const userToken = req.cookies[cookieName];

  if (!userToken) {
    res.render('error/not-authorized');
    return;
  }

  try {
    const decodedToken = jwt.verify(userToken, secret);
    const user = decodedToken;

    if (user.role === 'admin') {
      req.user = user;
      next();
    } else {
      res.render('error/not-authorized');
    }
  } catch (err) {
    res.render('error/not-authorized');
  }
};

export default isAdmin;
