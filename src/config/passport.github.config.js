import passport from 'passport';
import GitHubStrategy from 'passport-github2';
import Users from '../dao/models/user.model.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js'

// environment variables
const clientID = config.github.clientid;
const clientSecret = config.github.clientsecret;
const callbackURL = config.github.callbackurl;
const secret = config.jwt.key;
const cookieName = config.jwt.cookiename;

// configuration GitHub strategy with Passport
const initializePassportGH = () => {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: clientID,
        clientSecret: clientSecret,
        callbackURL: callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await Users.findOne({ email: profile._json.email });
          if (user) return done(null, user);

          const newUser = await Users.create({
            first_name: profile._json.name,
            email: profile._json.email,
            role: 'user',
          });
          const token = jwt.sign({ userId: newUser._id }, secret);
          res.cookie(cookieName, token, {
            httpOnly: true,
            secure: true,
          });
          return done(null, newUser);
        } catch (err) {
          return done('Error to login with GitHub');
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await Users.findById(id);
    done(null, user);
  });
};

export default initializePassportGH;
