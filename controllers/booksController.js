const jwt = require('jsonwebtoken');
const multer = require('multer');
const AppError = require('./../utils/appError');
const bookModel = require('./../models/bookModel');
const { catchAsyncErrors } = require('./errorController');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/');
        cb(null, `book-${req.book.id}-${Date.now()}.${ext}`);
    }
});

const upload = multer({dest: 'public/images'});
exports.uploadBookImage = upload.single('image');


exports.getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await bookModel.find();
    res.status(200).json({
        status: 'success',
        data: {
            books,
        }
    });
});

exports.getBookById = catchAsyncErrors(async (req, res, next) => {
    const book = await bookModel.findById(req.params.id);
    if(!book)   throw new AppError('book with given id does not exist', 404);
    res.status(200).json({
        status: 'success',
        data: {
            book,
        }
    });
});

exports.createBook = catchAsyncErrors(async (req, res, next) => {
    const newBook = await bookModel.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            book: newBook,
        }
    });
});

exports.updateBook = catchAsyncErrors(async (req, res, next) => {
    const updatedBook = await bookModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!updatedbook)   throw new AppError('book with given id does not exist', 404);
    res.status(200).json({
        status: 'success',
        data: {
            book: updatedBook,
        }
    });
});

exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
    const deletedBook = await bookModel.findByIdAndDelete(req.params.id);
    if(!deletedbook)   throw new AppError('book with given id does not exist', 404);
    res.status(204).json({
        status: 'success',
        data: null
    });
});