const { Router } = require('express');
const router = Router();

const Course = require('../models/course');

router.get('/:id/edit', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('edit', { title: 'Edit Course', course });
  } catch (e) {
    console.log(e);
  }
});

router.post('/:id/edit', async (req, res) => {
  try {
    const id = req.params.id;
    await Course.findByIdAndUpdate(id, req.body);

    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
