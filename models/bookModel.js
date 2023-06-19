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
});

// userSchema.pre('save', async function(next) {
//     // only encrypt the password if password is modified
//     if(!this.isModified('password')) return next();
    
//     this.password = await bcrypt.hash(this.password, 12);
//     next();
// });

// userSchema.methods.matchPassword = async (candidatePassword, userPassword) => {
//     return await bcrypt.compare(candidatePassword, userPassword);
// }

const Book = mongoose.model('Books', bookSchema);
module.exports = Book;