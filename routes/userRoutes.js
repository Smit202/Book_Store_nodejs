const express = require('express');
const router = express.Router();
const booksController = require('./../controllers/booksController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');



router.route('/signup')
// .get(userController.renderSignupPage)
.post(authController.signupUser);

// router.get('/', userController.renderHomePage);

router.route('/login')
// .get(userController.renderLoginPage)
.post(authController.loginUser);

router.use(authController.authenticate);

// router.route('/books')
// .get(booksController.getAllBooks, userController.renderAllBooksPage);

router.route('/books')
.get(booksController.getAllBooks);

router.route('/book/:bookId')
.get(booksController.getBookById);

// router.route('/book/:id')
// .get(booksController.getBookById, userController.renderBookDetailsPage);

router.route('/carts').get(userController.getUserAllCarts);
router.route('/cart/:cartId')
.get(userController.getUserCartById)
.delete(userController.deleteCart);

router.route('/book/:bookId/addToCart')
.post(userController.addToNewCart);

router.route('/book/:bookId/addToCart/:cartId')
.patch(userController.addToGivenCart);

router.route('/cart/:cartId/removeFromCart/:bookId')
.patch(userController.removeBookFromCart);

router.route('/cart/:cartId/changeQuantity/:bookId')
.patch(userController.updateBookCartQuantity);

router.route('/cart/:cartId/purchase').post(userController.orderBooks);
router.route('/orders').get(userController.getUserOrders);
router.route('/order/:orderId').get(userController.getUserOrderById);

module.exports = router;