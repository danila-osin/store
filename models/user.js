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
      count: Number,
      course: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    },
  ],
});

module.exports = model('User', user);
