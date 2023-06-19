const express = require('express');
const router = express.Router();
const adminController = require('./../controllers/adminController');
const booksController = require('./../controllers/booksController');
const authController = require('./../controllers/authController');

// router.route('/login')
// .get(adminController.renderLoginPage)
// .post(adminController.loginAdmin);

router.route('/books')
.get(authController.authenticate, authController.restrictToAdmin, booksController.getAllBooks);
  
// router.route('/admin/books/addBook')
// .get(booksController.renderCreateBookPage)
// .post(booksController.createBook);

// router.get('/book/:id', booksController.getBookById, adminController.renderAdminBookDetailsPage);

// router.route('/updateBook/:id')
// .get(adminController.renderUpdateBookPage)
// .patch(adminController.updateBook);

// router.delete('/deleteBook/:id', booksController.deleteBook);

router.route('/addBook').post(authController.authenticate, authController.restrictToAdmin, booksController.createBook);

router.route('/book/:id')
.get(authController.authenticate, authController.restrictToAdmin, booksController.getBookById)
.patch(authController.authenticate, authController.restrictToAdmin, booksController.updateBook)
.delete(authController.authenticate, authController.restrictToAdmin, booksController.deleteBook);

module.exports = router;