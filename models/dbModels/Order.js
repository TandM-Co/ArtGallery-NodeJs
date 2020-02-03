const mongoose = require('mongoose');
const schema = mongoose.Schema;

const orderSchema = new schema({
  seller: {
    type: schema.Types.ObjectId,
    ref: 'user',
  },
  customer: {
    type: schema.Types.ObjectId,
    ref: 'user',
  },
  shopItem: {
    type: schema.Types.ObjectId,
    ref: 'shopItem',
  },
  status: {
    type: String,
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Order = mongoose.model('order', orderSchema);
