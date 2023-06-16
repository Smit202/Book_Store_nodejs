const express = require('express');
const router = express.Router();
const userController = require('./../controllers/userController');
const booksController = require('./../controllers/booksController');
const authController = require('./../controllers/authController');

router.route('/signup')
// .get(userController.renderSignupPage)
.post(authController.signupUser);

// router.get('/', userController.renderHomePage);

router.route('/login')
// .get(userController.renderLoginPage)
.post(authController.loginUser);

// router.route('/books')
// .get(booksController.getAllBooks, userController.renderAllBooksPage);

// router.route('/book/:id')
// .get(booksController.getBookById, userController.renderBookDetailsPage);

module.exports = router;