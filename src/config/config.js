import dotenv from 'dotenv';
dotenv.config();

export default {
  app: {
    port: process.env.PORT,
  },
  persistence: process.env.PERSISTENCE,
  dblocal: {
    url: process.env.LOCAL_URL,
    dbname: process.env.LOCAL_DB,
  },
  mongo: {
    url: process.env.MONGO_URL,
    dbname: process.env.MONGO_DB,
    secret: process.env.SECRET,
  },
  github: {
    clientid: process.env.GITHUB_CLIENT_ID,
    clientsecret: process.env.GITHUB_CLIENT_SECRET,
    callbackurl: process.env.GITHUB_CALLBACK_URL,
    appid: process.env.GITHUB_APP_ID,
  },
  jwt: {
    key: process.env.PRIVATE_KEY,
    cookiename: process.env.JWT_COOKIE_NAME,
  },
};
