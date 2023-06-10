import mongoose from 'mongoose';

const messagesCollection = 'messages';

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    index: true,
  },
  message: String,
});

mongoose.set('strictQuery', false);
const messages = mongoose.model(messagesCollection, messagesSchema);

export default messages;
