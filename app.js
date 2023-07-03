const express = require('express');
const morgan = require('morgan');
const path = require('path')
const i18n = require('i18n');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');
const AppError = require('./utils/appError');
const { globalErrorHandler } = require('./controllers/errorController');

const app = express();

// internationalization
i18n.configure({
    locales: ['en', 'hi', 'gu'],
    directory: path.join(__dirname, '/public/locales'),
    retryInDefaultLocale: false,
    updateFiles: false,
});
app.use(i18n.init);

// using morgan and setting locale to only english during development
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV === 'development')  {
    app.use(morgan('dev'));
    app.use((req, res, next) => {
        req.setLocale('en');
        next();
    })
}

// setting security headers
app.use(helmet());

// limiting number of requests from same IP for security
const limiter = rateLimit({
    max: 2,
    windowMs: 60*60*1000,
    message: 'Too many requests from this IP, please try again in a hour!',
    handler: (req, res, next, options) => {
        throw new AppError(options.message, options.statusCode);
    }
});
app.use('/BookStore', limiter);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// to parse body and limit body size
app.use(express.json({ limit: '500kb' }));

// to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// routers
app.use('/BookStore/admin', adminRouter);   // routes for admin panel
app.use('/BookStore', userRouter);     // routes for user panel
app.get('/', (req, res, next) => {
    res.status(200).json({
        status: res.__('success'),
        message: res.__('Welcome to the book store application'),
    });
});

// Global error handling
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find the requested url in the server!`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
