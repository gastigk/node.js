// verfication if user is admin
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const secret = process.env.PRIVATE_KEY;
const cookieName = process.env.JWT_COOKIE_NAME;

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
