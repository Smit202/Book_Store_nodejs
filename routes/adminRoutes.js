const express = require('express');
const router = express.Router();
const adminController = require('./../controllers/adminController');
const booksController = require('./../controllers/booksController');

// router.route('/login')
// .get(adminController.renderLoginPage)
// .post(adminController.loginAdmin);

// router.route('/books')
// .get(booksController.getAllBooks);

// router.route('/admin/books/addBook')
// .get(booksController.renderCreateBookPage)
// .post(booksController.createBook);

// router.get('/book/:id', booksController.getBookById, adminController.renderAdminBookDetailsPage);

// router.route('/updateBook/:id')
// .get(adminController.renderUpdateBookPage)
// .patch(adminController.updateBook);

// router.delete('/deleteBook/:id', booksController.deleteBook);


router.route('/book/:id')
.get(booksController.getBookById)
.patch(adminController.updateBook)
.delete(adminController.deleteBook);

module.exports = router;