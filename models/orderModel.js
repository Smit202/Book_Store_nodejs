const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderedItems: {
        type: mongoose.Types.ObjectId,
        ref: 'Cart'
    },
    orderedOn: {
        type: Date,
        default: new Date(),
    }
});

const Order = mongoose.model('Orders', orderSchema);
module.exports = Order;