const { Router } = require('express');

const auth = require('../middleware/auth');
const Order = require('../models/order');

const router = Router();

function mapCourses(cart) {
  return cart.map((i) => ({
    course: { ...i.course._doc },
    count: i.count,
  }));
}

function mapOrders(orders) {
  return orders.map((o) => ({
    ...o._doc,
    price: computeTotalPrice(o.courses),
  }));
}

function computeTotalPrice(courses) {
  return courses.reduce((totalPrice, course) => {
    return (totalPrice += course.count * course.course.price);
  }, 0);
}

router.get('/', auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('user')
    .populate('courses.course')
    .exec();
  const mapedOrders = mapOrders(orders);

  res.render('orders', {
    title: 'Orders',
    orders: mapedOrders,
  });
});

router.post('/add', auth, async (req, res) => {
  try {
    const user = await req.user.populate('cart.course').execPopulate();
    const courses = mapCourses(user.cart);
    await Order.create({
      courses,
      user,
    });

    await req.user.clearCart();
    res.redirect('/orders');
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
