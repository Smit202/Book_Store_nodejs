const mongoose = require('mongoose');
const cartModel = require('./../models/cartModel');
const userModel = require('./../models/userModel');

const orderSchema = mongoose.Schema({
    orderedItems: {
        type: mongoose.Types.ObjectId,
        ref: 'Carts'
    },
    orderedOn: {
        type: Date,
        default: new Date(),
    }
});

orderSchema.post('save', async function(next) {
    const cart = await cartModel.findById(this.orderedItems);
    const user = await userModel.findById(cart.user);
    user.orders.push(this._id);
    await user.save();
    next();
});

const Order = mongoose.model('Orders', orderSchema);
module.exports = Order;