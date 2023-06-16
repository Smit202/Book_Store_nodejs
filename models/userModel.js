const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name cannot be empty"],
    },
    email: {
        type: String,
        required: [true, "email cannot be empty"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "email address is invalid"],
    },
    password: {
        type: String,
        required: [true, "password cannot be empty"],
        minlength: [8, "password must be minimum 8 characters long"],
        select: false
    },
    isAdmin: {
        type: Boolean,
        default: false,
        select: false,
    }
});

userSchema.pre('save', async function(next) {
    // only encrypt the password if password is modified
    if(!this.isModified('password')) return next();
    
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.matchPassword = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('Users', userSchema);
module.exports = User;