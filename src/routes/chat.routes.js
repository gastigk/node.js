import { Router } from 'express';
import Chat from '../dao/models/messages.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const messages = await Chat.find();
    res.render('chat', { messages });
  } catch (err) {
    res.status(500).render('error/under-maintenance');
  }
});

router.post('/', async (req, res) => {
  try {
    const { user, message } = req.body;
    const newMessage = new Chat({ user, message });
    await newMessage.save();
    res.redirect('/chat');
  } catch (err) {
    res.status(500).render('error/under-maintenance'); // dont saved the message
  }
});

export default router;
