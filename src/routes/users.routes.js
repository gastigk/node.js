import { Router } from 'express';
import User from '../dao/models/user.model.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getUserFromToken } from '../middlewares/user.middleware.js';

const router = Router();

// create new user
router.get('/', isAdmin, async (req, res) => {
  const user = getUserFromToken(req);
  try {
    const users = await User.find();
    const userObjects = users.map((user) => user.toObject());
    res.render('users', { users: userObjects, user });
  } catch (err) {
    console.error(err);
    res.status(500).render('error/under-maintenance');
  }
});

router.get('/edit/:id', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      user = getUserFromToken(req);
      return res.status(404).render('error/user-not-found');
    }

    res.render('editUser', { user });
  } catch (err) {
    res.status(500).render('error/under-maintenance');
  }
});

// edit user
router.post('/edit/:id', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, email, phone, age, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        first_name,
        last_name,
        email,
        phone,
        age,
        role,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).render('error/user-not-found');
    }

    res.redirect('/users');
  } catch (err) {
    console.error(err);
    res.status(500).render('error/under-maintenance');
  }
});

// delete user
router.get('/delete/:id', isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).render('error/user-not-found');
    }
    await User.findByIdAndRemove(userId); //remove user of the DBA

    res.render('userDelete', { user });
  } catch (err) {
    console.error(err);
    res.status(500).render('error/under-maintenance');
  }
});

export default router;
