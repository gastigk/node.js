const express = require('express');
const routerApi = require('../routes');
const handlebars = require('express-handlebars');
const path = require('path');
const { Server } = require('socket.io');
const {
  logErrors,
  errorHandler,
  boomErrorHandler,
} = require('../middlewares/error.handler');

const app = express();
const port = 8080;

app.use(express.json());
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

// configuración de Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', path.join(__dirname, '..', '..', '/views'));
app.set('view engine', 'handlebars');

routerApi(app);

// rutas principales
// app.use(express.static(path.join(__dirname, '..', '/public')));
// app.set('views', path.join(__dirname, '..', '/views'));

const httpServer = app.listen(port, () => {
  console.log('Mi port: ' + port);
});


// websocket
const socketServer = new Server(httpServer);

let log = [];
let newproduct = [];

socketServer.on('connection', (socketClient) => {
  let queryUser = socketClient.handshake.query.user;
  console.log(`Nuevo cliente "${queryUser}" conectado...`);
  socketClient.on('message', (data) => {
    console.log(`${data.user} Envió: ${data.message}`);
    log.push(data);
    socketClient.emit('history', log);
    socketServer.emit('history', log);
  });
  socketClient.on('product', (dataProd) => {
    newproduct.push(dataProd);
    socketClient.emit('product-list', newproduct);
    socketServer.emit('product-list', newproduct);
  });
  socketClient.broadcast.emit('newUser', queryUser);
});
