// importación de librería para validación de esquemas de objetos
const Joi = require('joi');

const pid = Joi.string().uuid();
const title = Joi.string().min(3).max(15);
const description = Joi.string().min(3).max(50);
const code = Joi.string().max(7);
const price = Joi.number().integer().min(5);
const status = Joi.boolean();
const stock = Joi.number().integer().max(4);
const category = Joi.string().min(3).max(20);
const thumbnails = Joi.string().uri();

// datos requeridos de carga al crear
const createProductSchema = Joi.object({
  title: title.required(),
  description: description.required(),
  code: code.required(),
  price: price.required(),
  status: status.required(),
  stock: stock.required(),
  category: category.required(),
});

// datos para actualizar producto
const updateProductSchema = Joi.object({
  title: title,
  description: description,
  code: code,
  price: price,
  status: status,
  stock: stock,
  category: category,
  thumbnails: thumbnails
});

// validación del pid para la búsqueda
const getProductSchema = Joi.object({
  pid: pid.required(),
});

module.exports = { createProductSchema, updateProductSchema, getProductSchema }
