const multer = require('multer');
const crypto = require('crypto');
const AppError = require('./../utils/appError');
const bookModel = require('./../models/bookModel');
const { catchAsyncErrors } = require('./errorController');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        console.log(file);
        const ext = file.mimetype.split('/')[1]; 
        cb(null, `book-${crypto.randomBytes(8).toString('hex')}-${Date.now()}.${ext}`);
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

exports.getAllBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await bookModel.find();
    res.status(200).json({
        status: res.__('success'),
        data: {
            books,
        }
    });
});

exports.getBookById = catchAsyncErrors(async (req, res, next) => {
    const book = await bookModel.findById(req.params.id);
    if(!book)   throw new AppError('book with given id does not exist', 404);
    res.status(200).json({
        status: res.__('success'),
        data: {
            book,
        }
    });
});

exports.createBook = catchAsyncErrors(async (req, res, next) => {
    console.log(req.file);
    console.log(req.body);
    let filterBody = {...req.body};
    if(req.file) filterBody.photo = req.file.filename;
    const newBook = await bookModel.create(filterBody);
    res.status(201).json({
        status: res.__('success'),
        data: {
            book: newBook,
        }
    });
});

exports.updateBook = catchAsyncErrors(async (req, res, next) => {
    const updatedBook = await bookModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if(!updatedbook)   throw new AppError('book with given id does not exist', 404);
    res.status(200).json({
        status: res.__('success'),
        data: {
            book: updatedBook,
        }
    });
});

exports.deleteBook = catchAsyncErrors(async (req, res, next) => {
    const deletedBook = await bookModel.findByIdAndDelete(req.params.id);
    if(!deletedBook)   throw new AppError('book with given id does not exist', 404);
    res.status(204).json({
        status: res.__('success'),
        data: null
    });
});