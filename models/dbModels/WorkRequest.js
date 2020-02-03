const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workRequestSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
  },
  work: {
    type: Schema.Types.ObjectId,
    ref: 'work',
  },
  text: {
    type: String
  },
});

module.exports = ShopItem = mongoose.model('workRequest', workRequestSchema);