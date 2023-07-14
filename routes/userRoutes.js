const express = require('express');
const router = express.Router();
const booksController = require('./../controllers/booksController');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.use(authController.authenticate);

router.route('/signup')
// .get(userController.renderSignupPage)
.post(authController.signupUser);

// router.get('/', userController.renderHomePage);

router.route('/login')
// .get(userController.renderLoginPage)
.post(authController.loginUser);

// router.route('/books')
// .get(booksController.getAllBooks, userController.renderAllBooksPage);

router.route('/books')
.get(booksController.getAllBooks);

router.route('/book/:id')
.get(booksController.getBookById);

// router.route('/book/:id')
// .get(booksController.getBookById, userController.renderBookDetailsPage);

router.route('/carts').get(userController.getUserAllCarts);
router.route('/cart/:cartId').get(userController.getUserCartById);

router.route('/book/:bookId/addToCart/:cartId').get(userController.addToCart);

router.route('/cart/:cartId/purchase').get(userController.orderBooks);

module.exports = router;