// importación de librería para validación de esquemas de objetos
const Joi = require('joi');

const cid = Joi.string().uuid();
const products = Joi.any();

// datos requeridos de carga al crear
const createCartsSchema = Joi.object({
  products: products.required(),
});

// validación del pid para la búsqueda
const getCartsSchema = Joi.object({
  cid: cid.required(),
});

// validación post producto
const postProductsSchema = Joi.object({
    cid: cid.required(),
  });

module.exports = { createCartsSchema, getCartsSchema, postProductsSchema };
