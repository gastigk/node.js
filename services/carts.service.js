const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');

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
        products: faker.datatype.array(),
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

  // actualización de datos
  async update(cid, changes) {
    const index = this.carts.findIndex((item) => item.cid === cid);
    if (index === -1) {
      throw boom.notFound('cart not found');
    }
    const cart = this.carts[index];
    this.carts[index] = {
      quantify: quantify++,
      ...changes
    };
    return this.carts[index];
  }
}

module.exports = CartsService;
