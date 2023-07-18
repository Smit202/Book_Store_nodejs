const mongoose = require('mongoose');
const cartModel = require('./../models/cartModel');
const userModel = require('./../models/userModel');

const orderSchema = mongoose.Schema({
    orderedCart: {
        type: mongoose.Types.ObjectId,
        ref: 'Carts'
    },
    orderedItems: {
        type: [{
            _id: false,
            book: {
                type: mongoose.Types.ObjectId,
                ref: 'Books',
                required: true,
            },
            quantity: {
                type: Number,
                required: [true, "Provide book purchase quantity"],
            }
        }],
        required: true,
    },
    orderAmount: {
        type: Number,
        required: true,
    },
    orderedOn: {
        type: Date,
        default: new Date(),
    }
});

orderSchema.post('save', async function() {
    const cart = await cartModel.findById(this.orderedCart);
    const user = await userModel.findById(cart.user);
    user.orders.push(this._id);
    await user.save();
    // next();
});

const Order = mongoose.model('Orders', orderSchema);
module.exports = Order;