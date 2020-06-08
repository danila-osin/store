const { Schema, model } = require('mongoose');

const order = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
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
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
    },
  ],
});

module.exports = model('Order', order);
