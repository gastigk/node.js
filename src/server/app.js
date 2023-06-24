import express from 'express';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import path from 'path';
import session from 'express-session';
import methodOverride from 'method-override';
import MongoStore from 'connect-mongo';
import exphbs from 'express-handlebars';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { Command } from 'commander';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import flash from 'express-flash';
import cors from 'cors';

// import middlewares
import initializePassportGH from '../middlewares/passportGithub.js';
import initializePassport from '../middlewares/passport.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';

// import models
import Messages from '../dao/models/messages.model.js';

// sever up
const port = 8080;
const app = express();
const httpServer = app.listen(port, () => {
  console.log(`Listening http://localhost:${port}`);
});

// definning __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// routes
import indexRouter from '../routes/index.routes.js';
import chatRouter from '../routes/chat.routes.js';
import productRouter from '../routes/products.routes.js';
import productsEditRouter from '../routes/productseditid.routes.js';
import productsdeletebyidRouter from '../routes/productsdeletebyid.routes.js';
import productsIdRouter from '../routes/productsid.routes.js';
import productsTableRouter from '../routes/productstable.routes.js';
import productsInRealTimeRouter from '../routes/productsInRealTime.routes.js';
import productsEditByIdRouter from '../routes/productseditbyid.routes.js';
import cartRouter from '../routes/carts.routes.js';
import cartsProductDelecteRouter from '../routes/cartsProductDelete.routes.js';
import loginRouter from '../routes/login.routes.js';
import loginGithubRouter from '../routes/logingithub.routes.js';
import singupRouter from '../routes/signup.routes.js';
import signupAdminRouter from '../routes/signupadmin.routes.js';
import logoutRouter from '../routes/logout.routes.js';
import checkoutRouter from '../routes/checkout.routes.js';
import usersRouter from '../routes/users.routes.js';
import adminPanel from '../routes/adminPanel.routes.js';

// configuration Commander
const program = new Command();
program
  .option('--mode <mode>', 'Port', 'prod')
  .option('--database <database>', 'BDA', 'atlas');
program.parse();

// read environment variables
dotenv.config();

// environment variables
const prodPort = process.env.PROD_PORT;
const devPort = process.env.DEV_PORT;

const prodMongo = process.env.MONGO_URL;
const prodBD = process.env.MONGO_DBA;
const localBD = process.env.LOCAL_URL;
const localBDName = process.env.LOCAL_DBA;

// verification option --database
if (program.opts().database === 'atlas') {
  process.env.MONGO_URL = prodMongo;
  process.env.MONGO_DBA = prodBD;
} else {
  process.env.MONGO_URL = localBD;
  process.env.MONGO_DBA = localBDName;
}

// configuration of mongoose
const mongoConnection = process.env.MONGO_URL;
const mongoDatabase = process.env.MONGO_DBA;

async function connectToDatabase() {
  try {
      await mongoose.connect(mongoConnection);
      console.log(`Successful connection to the database "${mongoDatabase}"`);
  } catch (error) {
      console.log(`Cannot connect to database ${mongoDatabase}. Error type: ${error}`);
      process.exit();
  }
}
connectToDatabase();

// configuration middleware express-session con MongoStore
const secret = process.env.SECRET;
app.use(
  session({
    secret: secret,
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: mongoConnection,
      dbName: mongoDatabase,
      collectionName: 'sessions',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    }),
  })
);
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.user ? true : false;
  res.locals.userRole = req.session.user ? req.session.user.role : null;
  next();
});

// inicialization Passport y Passport Github
initializePassportGH();
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// configuration of handlebars
const handlebarsOptions = {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true,
};

app.engine(
  'handlebars',
  exphbs.engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
  })
);
app.set('view engine', 'handlebars');

// configuration middleware cookieParser
app.use(cookieParser());

// configuration middleware express-flash
app.use(flash());

// configuration JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// configuration bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// configuration of forms
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// views
app.use(express.static(path.resolve('..', 'public')));
app.set('views', '../views/');
app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/productstable', productsTableRouter);
app.use('/productsdeletebyid', productsdeletebyidRouter);
app.use('/productsedit', productsEditRouter);
app.use('/productseditbyid', productsEditByIdRouter);
app.use('/productsid', productsIdRouter);
app.use('/carts', cartRouter);
app.use('/chat', chatRouter);
app.use('/login', loginRouter);
app.use('/signup', singupRouter);
app.use('/logout', logoutRouter);
app.use('/realTimeProducts', productsInRealTimeRouter);
app.use('/cart-product-delete', cartsProductDelecteRouter);
app.use('/checkout', checkoutRouter);
app.use('/users', usersRouter);
app.use('/signupadmin', signupAdminRouter);
app.use('/github', loginGithubRouter);
app.use('/admin-panel', adminPanel);
app.get('*', (req, res) => {
  const user = getUserFromToken(req);    
  (!user) ? res.status(404).render('error/error-page'):
  res.status(404).render('error/error-page', { user });  
});

// configuration of cors
app.use(cors())

// configuration of websocket
const socketServer = new Server(httpServer);

let log = [];
let newproduct = [];

socketServer.on('connection', (socketClient) => {
  let queryUser = socketClient.handshake.query.user;

  socketClient.on('message', (data) => {
    console.log(`${data.user} Envió: ${data.message}`);
    log.push(data);
    socketClient.emit('history', log);
    socketClient.broadcast.emit('history', log);

    Messages.findOneAndUpdate(
      { user: data.user },
      { $push: { message: data.message } },
      { upsert: true }
    )
      .then(() => {})
      .catch((err) => {});
  });

  socketClient.on('product', (dataProd) => {
    newproduct.push(dataProd);
    socketClient.emit('product-list', newproduct);
    socketClient.broadcast.emit('product-list', newproduct);
  });

  socketClient.broadcast.emit('newUser', queryUser);
});
