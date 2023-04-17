const express = require('express');
const routerApi = require('../routes');

const { logErrors, errorHandler, boomErrorHandler } = require('../middlewares/error.handler');

const app = express();
const port = 8080;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('¡Hola! Soy el servidor del puerto 8080.');
});

routerApi(app);

app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);


app.listen(port, () => {
  console.log('Mi port: ' +  port);
});