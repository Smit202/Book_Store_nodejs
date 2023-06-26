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
        const ext = file.mimetype.split('/')[1];
        cb(null, `book-${req.body.id}-${Date.now()}.${ext}`);
    }
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError('Please upload only image!', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.uploadBookImage = upload.single('photo');

exports.setBookImage = catchAsyncErrors(async (req, res, next) => {
    const filename = req.file.filename;
    const id = filename.split('-')[1];
    const newBook = await bookModel.findByIdAndUpdate(id, {photo: filename});
    res.status(201).json({
        status: 'success',
        data: {
            book: newBook,
        }
    });
});

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
    console.log(req.body);
    let filterBody = {...req.body};
    if(req.file) filterBody.photo = req.file.filename;
    const newBook = await bookModel.create(filterBody);
    console.log(req.file);
    console.log(req.body);
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