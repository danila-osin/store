const { Router } = require('express');
const bcrypt = require('bcryptjs');

const router = Router();

const User = require('../models/user');

router.get('/', (req, res) => {
  res.render('auth/login', {
    title: 'Authentication',
    regErr: req.flash('regErr'),
    logErr: req.flash('logErr'),
  });
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;

        req.session.save((err) => {
          if (err) {
            throw err;
          } else {
            res.redirect('/');
          }
        });
      } else {
        req.flash('logErr', 'Password is wrong');
        res.redirect('/auth#login');
      }
    } else {
      req.flash('logErr', "User with this email doesn't exist");
      res.redirect('/auth#login');
    }
  } catch (e) {
    console.log(e);
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('regErr', 'User with this email already exists');
      res.redirect('/auth#register');
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        name,
        email,
        password: hashedPassword,
        cart: [],
      });
      res.redirect('/auth#login');
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
