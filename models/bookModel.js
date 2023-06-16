const mongoose = require('mongoose');
const validator = require('validator');

const categories = ['Adventure', 'Classics', 'Crime', 'Fantasy', 'Horror', 'Mystery', 'History', 'Poetry', 'Romance', 'Science fiction', 'Biography'];

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
    description: {
        type: String
    },
    category: {
        type: String,
        enum: categories,
    },
    pages: {
        type: Number,
    },
    price: {
        type: Number,
    },
    Quantity: {
        type: Number,
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