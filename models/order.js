const { Schema, model } = require('mongoose');

const order = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  username: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  courses: [
    {
      count: {
        type: Number,
        required: true,
      },
      course: {
        type: Object,
        required: true,
      },
    },
  ],
});

module.exports = model('Order', order);
