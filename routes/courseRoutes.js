const { Router } = require('express');
const router = Router();

const Course = require('../models/course');

const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.render('courses', { courses, title: 'All Courses' });
});

router.get('/add', auth, (req, res) => {
  res.render('add', { title: 'New Course' });
});

router.post('/add', auth, async (req, res) => {
  try {
    await Course.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      img: req.body.img,
    });
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
