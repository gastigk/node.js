const { faker } = require('@faker-js/faker');
const boom = require('@hapi/boom');

class ProductsService {
  constructor() {
    this.products = [];
    this.generate();
  }

  // campos a generar
  generate() {
    const limit = 100;
    for (let index = 0; index < limit; index++) {
      this.products.push({
        pid: faker.datatype.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.random.alphaNumeric(7),
        price: faker.commerce.price(100, 20000, 0, '$'),
        status: faker.datatype.boolean(),
        stock: faker.random.numeric(4),
        category: faker.commerce.productAdjective(),
        thumbnails: faker.image.imageUrl(),
        // isBlock: faker.datatype.boolean(),
      });
    }
  }

  // creación nuevo producto
  async create(data) {
    const newProduct = {
      pid: faker.datatype.uuid(),
      ...data,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // listar con setTimeout
  get() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.products);
      }, 3000);
    });
  }

  // búsqueda por pid
  async getById(pid) {
    const product = this.products.find((item) => item.pid === pid);
    if (!product) {
      throw boom.notFound('product not found');
    }
    // // if (product.isBlock) {
    // //   throw boom.conflict('product is block');
    // // }
    return product;
  }

  // actualización de datos
  async update(pid, changes) {
    const index = this.products.findIndex((item) => item.pid === pid);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    const product = this.products[index];
    this.products[index] = {
      ...product,
      ...changes,
    };
    return this.products[index];
  }

  // eliminar producto
  async delete(pid) {
    const index = this.products.findIndex((item) => item.pid === pid);
    if (index === -1) {
      throw boom.notFound('product not found');
    }
    this.products.splice(index, 1);
    return { pid };
  }
}

module.exports = ProductsService;
