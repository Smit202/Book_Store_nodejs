const bookModel = require('./../models/bookModel');
const userModel = require('./../models/userModel');
const cartModel = require('./../models/cartModel');
const orderModel = require('./../models/orderModel');
const { catchAsyncErrors } = require('./errorController');
const AppError = require('./../utils/appError');
const { default: mongoose } = require('mongoose');

exports.getUserAllCarts = catchAsyncErrors(async (req, res, next) => {
    // const userCarts = await userModel.findById(req.user.id, 'carts').populate('carts').populate('book', 'title author price');
    const userCarts = await cartModel.find({ user: req.user._id }).populate('cartItems.book', 'title author price');
    res.status(200).json({
        status: res.__('success'),
        data: {
            userCarts,
        }
    });
});

exports.getUserCartById = catchAsyncErrors(async (req, res, next) => {
    const userCart = await cartModel.find({ _id: req.params.cartId, user: req.user.id }).populate('cartItems.book', 'title author price');
    if(!userCart.length)   throw new AppError('cart with given id does not exist', 404);
    res.status(200).json({
        status: res.__('success'),
        data: {
            userCart,
        }
    });
});

exports.addToNewCart = catchAsyncErrors(async (req, res, next) => {
    const bookId = req.params.bookId;
    if(!await bookModel.findById(bookId)) throw new AppError('book with given id does not exist', 404);
    const quantity = req.query.quantity ? req.query.quantity : 1;
    const book = {
        book: bookId,
        quantity,
    };

    const cart = {
        user: req.user._id,
        cartItems: [book]
    };
    const newCart = await cartModel.create(cart);

    res.status(201).json({
        status: res.__('success'),
        message: res.__("New cart is created and book is successfully added to that cart"),
        data: {
            cart: newCart
        }
    });
});

exports.addToGivenCart = catchAsyncErrors(async (req, res, next) => {
    const bookId = req.params.bookId;
    const cartId = req.params.cartId;
    if (!await bookModel.findById(bookId)) throw new AppError('book with given id does not exist', 404);
    const quantity = req.query.quantity ? +req.query.quantity : 1;
    const book = {
        book: bookId,
        quantity,
    };

    const cart = await cartModel.findById(cartId);
    if (!cart) throw new AppError('cart with given id does not exist', 404);
    // increasing quantity if book is already in cart otherwise adding new book
    const bookIndex = cart.cartItems.findIndex(item => item.book == bookId);
    console.log(bookIndex);
    if (bookIndex === -1) {
        await cart.cartItems.push(book);
    }
    else {
        cart.cartItems[bookIndex].quantity += quantity;
    }
    await cart.save();

    res.status(200).json({
        status: res.__('success'),
        message: res.__("Book is successfully added to cart"),
        data: {
            cart,
        }
    });
});

exports.deleteCart = catchAsyncErrors(async (req, res, next) => {
    const deletedCart = await cartModel.findByIdAndDelete(req.params.cartId)
    if(!deletedCart)   throw new AppError('cart with given id does not exist', 404);
    res.status(204).json({
        status: res.__('success'),
        data: null,
    });
});

exports.removeBookFromCart = catchAsyncErrors(async (req, res, next) => {
    const bookId = req.params.bookId;
    const cartId = req.params.cartId;
    if (!await bookModel.findById(bookId)) throw new AppError('book with given id does not exist', 404);

    const cart = await cartModel.findById(cartId);
    if (!cart) throw new AppError('cart with given id does not exist', 404);

    const bookIndex = cart.cartItems.findIndex(item => item.book == bookId);
    if (bookIndex === -1) {
        throw new AppError('This book is not present in cart', 404);
    }
    else {
        cart.cartItems.splice(bookIndex, 1);
    }
    await cart.save();

    res.status(200).json({
        status: res.__('success'),
        message: res.__("Book is successfully removed from cart"),
        data: {
            cart,
        }
    });
});

exports.updateBookCartQuantity = catchAsyncErrors(async (req, res, next) => {
    const bookId = req.params.bookId;
    const cartId = req.params.cartId;
    const cart = await cartModel.findById(cartId);

    if (!cart) throw new AppError('cart with given id does not exist', 404);
    if (!await bookModel.findById(bookId)) throw new AppError('book with given id does not exist', 404);
    if (!req.query.quantity) throw new AppError('Provide book quantity to be changed in query parameter', 404);

    const bookIndex = cart.cartItems.findIndex(item => item.book == bookId);
    if (bookIndex === -1) {
        throw new AppError('This book is not present in cart', 404);
    }
    else {
        cart.cartItems[bookIndex].quantity = req.query.quantity;
    }
    await cart.save();

    res.status(200).json({
        status: res.__('success'),
        message: res.__("Book quantity is successfully updated in cart"),
        data: {
            cart,
        }
    });
});

exports.orderBooks = catchAsyncErrors(async (req, res, next) => {
    const cart = await cartModel.findById(req.params.cartId);
    if(!cart)   throw new AppError('cart with given id does not exist', 404);
    cart.cartItems.forEach(item => delete item.addedOn);
    const orderedCart = req.params.cartId;
    const orderedItems = cart.cartItems;
    const orderAmount = cart.cartTotal;
    const order = await orderModel.create({ orderedCart, orderedItems, orderAmount });

    res.status(201).json({
        status: res.__('success'),
        message: res.__("Order is successful"),
        data: {
            order,
        }
    });
});

exports.getUserOrders = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.user.id).populate({
        path: 'orders',
        populate: {
            path: 'orderedItems.book',
            select: 'title author price'
        }
    });
    const orders = await user.orders;
    res.status(200).json({
        status: res.__('success'),
        data: {
            orders,
        }
    });
});

exports.getUserOrderById = catchAsyncErrors(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    const orderId = req.params.orderId;
    if(!user.orders.includes(orderId))    throw new AppError('order with given id does not exist', 404);
    const order = await orderModel.findById(orderId).populate('orderedItems.book', 'title author price');
    res.status(200).json({
        status: res.__('success'),
        data: {
            order,
        }
    });
});

