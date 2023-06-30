
const express = require('express');
const morgan = require('morgan');
const i18n = require('i18n');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const AppError = require('./utils/appError');
const { globalErrorHandler } = require('./controllers/errorController');

const app = express();
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development')  app.use(morgan('dev'));

app.use(express.json());

app.use('/BookStore/admin', adminRouter);   // routes for admin panel
app.use('/BookStore', userRouter);     // routes for user panel
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Welcome to the book store application',
    });
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the requested url in the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
