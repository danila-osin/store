const { Router } = require('express');
const router = Router();

const Course = require('../models/course');

const auth = require('../middleware/auth');

router.get('/:id/edit', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render('edit', { title: 'Edit Course', course });
  } catch (e) {
    console.log(e);
  }
});

router.post('/:id/edit', auth, async (req, res) => {
  try {
    const id = req.params.id;
    await Course.findByIdAndUpdate(id, req.body);

    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id });
    res.redirect('/courses');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
