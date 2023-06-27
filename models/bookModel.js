const mongoose = require('mongoose');
const validator = require('validator');

const bookSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Provide book title"],
    },
    publisher: {
        type: String,
        required: [true, "Provide book publisher's name"],
    },
    author: {
        type: [String],
        required: [true, "Provide book's author name"],
    },
    ISBN: {
        type: String,
        required: [true, "Provide book's ISBN number"],
        unique: true,
        validate: [validator.isISBN, "Provide valid ISBN number"],
    },
    language: {
        type: String,
    },
    category: {
        type: [String],
        required: [true, 'Provide book category'],
    },
    pages: {
        type: Number,
    },
    price: {
        type: Number,
        required: [true, "Provide book price"],
    },
    description: {
        type: String,
        required: [true, "Provide book description"],
    },
    quantity: {
        type: Number,
        required: [true, "Provide quanity of available books"],
    },
    photo: {
        type: String,
        // required: [true, 'provide book image'],
        default: 'default.png',
    }
});

const Book = mongoose.model('Books', bookSchema);
module.exports = Book;