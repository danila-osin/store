const { Schema, model } = require('mongoose');

const user = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: [
    {
      count: {
        type: Number,
        default: 1,
      },
      course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
      },
    },
  ],
  // orders: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Order',
  //   },
  // ],
});

user.methods.addToCart = async function (course) {
  const courses = [...this.cart];
  const idx = courses.findIndex(
    (c) => c.course.toString() === course._id.toString()
  );

  if (idx !== -1) {
    courses[idx].count += 1;
  } else {
    courses.push({ count: 1, course });
  }

  this.cart = courses;
  return await this.save();
};

user.methods.removeFromCart = async function (id) {
  console.log(id);
  let courses = [...this.cart];
  const idx = courses.findIndex((c) => c.course.toString() === id.toString());
  console.log(idx);
  if (courses[idx].count !== 1) {
    courses[idx].count -= 1;
  } else {
    courses = courses.filter((c) => c.course.toString() !== id.toString());
  }

  this.cart = courses;
  return await this.save();
};

user.methods.clearCart = async function () {
  this.cart = [];
  return await this.save();
};

module.exports = model('User', user);
