const bookModel = require('./../models/bookModel');
const userModel = require('./../models/userModel');
const cartModel = require('./../models/cartModel');
const orderModel = require('./../models/orderModel');
const { catchAsyncErrors } = require('./errorController');

exports.getUserAllCarts = catchAsyncErrors(async (req, res, next) => {
    const userCarts = await userModel.findById(req.user.id, 'carts').populate('carts').populate('book', 'title author price');
    res.status(200).json({
        status: res.__('success'),
        data: {
            userCarts,
        }
    });
});

exports.getUserCartById = catchAsyncErrors(async (req, res, next) => {
    const userCart = await cartModel.findById(req.params.cartId).populate('book', 'title author price');
    if(!userCart)   throw new AppError('cart with given id does not exist', 404);
    res.status(200).json({
        status: res.__('success'),
        data: {
            userCart,
        }
    });
});

exports.addToCart = catchAsyncErrors(async (req, res, next) => {
    const bookId = req.params.bookId;
    const cartId = req.params.cartId;
    if(!await bookModel.findById(bookId)) throw new AppError('book with given id does not exist', 404);
    const quantity = req.query.quantity ? req.query.quantity : 1;
    const book = {
        book: bookId,
        quantity,
    };

    if(req.params.cartId) {
        
        const cart = await cartModel.findById(cartId);
        if(!cart) throw new AppError('cart with given id does not exist', 404);
        // increasing quantity if book is already in cart otherwise adding new book
        const bookIndex = cart.cartItems.findIndex(item => item.book === bookId);
        if(bookIndex === -1) {
            await cart.cartItems.push(book);
        }
        else {
            cart.cartItems[bookIndex].quantity += await quantity;
        }
        await cart.save();

        res.status(200).json({
            status: res.__('success'),
            message: "Book is successfully added to cart",
            data: {
                cart,
            }
        });
    }

    const cart = {
        user: req.user._id,
        cartItems: [book]
    };
    const newCart = await cartModel.create(cart);

    res.status(201).json({
        status: res.__('success'),
        message: "New cart is created and book is successfully added to that cart",
        data: {
            cart: newCart
        }
    });
});

exports.orderBooks = catchAsyncErrors(async (req, res, next) => {
    const cart = await cartModel.findById(req.params.cartId)
    if(!cart)   throw new AppError('cart with given id does not exist', 404);
    const order = await orderModel.create({ orderedItems: req.params.cartId });
    res.status(200).json({
        status: res.__('success'),
        data: {
            order,
        }
    });
});