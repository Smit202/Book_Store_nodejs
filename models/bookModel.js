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
    ratings : {
        type: Number,
        required: [true, 'Provide book ratings'],
        min: [1, 'Ratings must be above 1.0'],
        max: [5, 'Ratings must be below 5.0']
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

// bookSchema.index({
//     title: 'text',
//     author: 'text'
// }, {
//     weights: {
//         title: 5,
//         author: 1
//     }
// });

const Book = mongoose.model('Books', bookSchema);
// Book.collection.createIndex({
//     title: 'text',
//     author: 'text'
// });
// Book.syncIndexes();
// Book.collection.dropIndex('title_text_author_text', (err, result) => {
//     if(err) console.log(err);
//     else console.log(result);
// });

module.exports = Book;