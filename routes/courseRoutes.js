const { Router } = require('express');
const router = Router();

const Course = require('../models/course');

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.render('courses', { courses, title: 'All Courses' });
});

router.get('/add', (req, res) => {
  res.render('add', { title: 'New Course' });
});

router.post('/add', async (req, res) => {
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
