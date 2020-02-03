const mongoose = require('mongoose');
const schema = mongoose.Schema;

const basketSchema = new schema({
    user: {
        type: schema.Types.ObjectId,
        ref: 'user'
    },
    shopItems: [
        {
            item: {
                type: schema.Types.ObjectId,
                ref: 'shopItem'
            },
            count: {
                type: Number,
                default: 1,
            }
        }
    ],
    price: {
        type: String
    }
});

module.exports = Basket = mongoose.model('basket', basketSchema);