import mongoose from 'mongoose';

const userCollection = 'users';

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
  },
  last_name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    index: true,
  },
  phone: {
    type: String,
    unique: true,
  },
  age: {
    type: String,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: false,
  },
});

mongoose.set('strictQuery', false);
const userModel = mongoose.model(userCollection, userSchema);

export default userModel;
