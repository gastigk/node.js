// verfication if someone is login
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'user') {
    next();
  } else {
    res.redirect('/login');
  }
};

export default isLoggedIn;
