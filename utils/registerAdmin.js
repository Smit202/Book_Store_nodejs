const mongoose = require('mongoose');
const userModel = require('./../models/userModel');
const dotenv = require('dotenv');

dotenv.config({path: './config.env'});
mongoose.connect(process.env.DATABASE).then(() => console.log('connected with database'));

let admin = {
  "name": "smit",
  "email": "smit@gmail.com",
  "password": "smitsheth",
  "isAdmin": true,
}

userModel.create(admin)
.then((result) => {
  console.log('admin is registered successfully');
  console.log(result);
})
.catch(err => console.log(err));



