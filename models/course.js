const { Schema, model } = require('mongoose');

const course = new Schema({
  title: {
    type: String,
    required: true,
  },
  img: String,
  description: String,
  price: {
    type: Number,
    required: true,
  },
});

module.exports = model('Course', course);
