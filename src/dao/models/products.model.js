import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'Product';

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      min: 1,
      max: 100000,
    },
    status: {
      type: Boolean,
      required: true,
    },
    stock: {
      type: Number,
      min: 1,
      max: 1000,
    },
    code: {
      type: String,
      required: true,
    },
    thumbnails: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

mongoose.set('strictQuery', false);
productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
