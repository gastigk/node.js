import { Router } from 'express';
import Chat from '../dao/models/messages.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Chat.find();
    res.render('chat', { messages });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error! try again');
  }
});

router.post('/', async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = new Chat({ user, message });
    await newMessage.save();
    res.redirect('/chat');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error! dont saved the message');
  }
});

export default router;
