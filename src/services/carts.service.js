const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');

const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../..', 'products.json');
const carritoFilePath = path.join(__dirname, '../..', 'carts.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
let carrito = JSON.parse(fs.readFileSync(carritoFilePath, 'utf-8'));

class CartsService {
  constructor() {
    this.carts = [];
    this.generate();
  }

  // campos a generar
  generate() {
    const limit = 10;
    for (let index = 0; index < limit; index++) {
      this.carts.push({
        cid: faker.datatype.uuid(),
        products: [],
        quantify: faker.datatype.number(10),
      });
    }
  }

  // creación nuevo carrito
  async create(data) {
    const newCart = {
      cid: faker.datatype.uuid(),
      ...data,
    };
    this.carts.push(newCart);
    return newCart;
  }

  // listar con setTimeout
  get() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.carts);
      }, 1500);
    });
  }

  // búsqueda por cid
  async getById(cid) {
    const cart = this.carts.find((item) => item.cid === cid);
    if (!cart) {
      throw boom.notFound('cart not found');
    }
    return cart;
  }

  // post de porductos
  async update(cid, changes) {
    const id = Number(req.params.id);
    const producto = products.find(product => product.cid === cid);

    if (producto) {
      const productoEnCarritoExistente = carrito.find(producto => producto.producto.pid === pid);

      if (productoEnCarritoExistente) {
          productoEnCarritoExistente.cantidad++;
      } else {
          const productoEnCarrito = {
              cid: carrito.length + 1,
              cantidad: 1,
              producto: {
                  ...producto,
                  price: parseInt(producto.price)
              }
          };
          carrito.push(productoEnCarrito);
      }

      fs.writeFile(carritoFilePath, JSON.stringify(carrito), (err) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error al agregar producto al carrito');
          }
          res.render('carts', { carrito });
      });

  } else {
      res.status(404).send('Producto no encontrado');
  }

  }
}

module.exports = CartsService;
