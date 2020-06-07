const { Router } = require('express');

const router = Router();

const User = require('../models/user');
const Course = require('../models/course');

const auth = require('../middleware/auth');

function mapCourses(cart) {
  return cart.map((i) => ({
    ...i.course._doc,
    count: i.count,
  }));
}

function computeTotalPrice(courses) {
  return courses.reduce((totalPrice, course) => {
    return (totalPrice += course.count * course.price);
  }, 0);
}

router.get('/', auth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.course').execPopulate();
    const courses = mapCourses(user.cart);
    res.render('cart', {
      title: 'Cart',
      courses,
      price: computeTotalPrice(courses),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);
    await req.user.addToCart(course);

    res.redirect('/cart');
  } catch (e) {
    console.log(e);
  }
});

router.delete('/:id/remove', async (req, res) => {
  await req.user.removeFromCart(req.params.id);

  const user = await req.user.populate('cart.course').execPopulate();
  const courses = mapCourses(user.cart);
  const cart = {
    courses,
    price: computeTotalPrice(courses),
  };
  res.json(cart);
});

module.exports = router;
