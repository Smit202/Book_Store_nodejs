const AppError = require("./../utils/appError");

const handleDBValidationError = err => {
    const errorMessage = Object.values(err.errors).map(item => item.message).join('. ');
    return new AppError(errorMessage, 400);
}

const handleDBCastError = err => {
    return new AppError(`Invalid ${err.path}: ${err.value}`, 400);
}

const sendDevelopmentError = (err, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
}

const sendProductionError = (err, res) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'Error';

    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.log(err);
        res.status(500).json({
            status: 'error',
            message: 'Programming error at server side!',
        });
    }
}

exports.globalErrorHandler = (err, req, res, next) => {

    if(process.env.NODE_ENV === 'development') {
        sendDevelopmentError(err, res);
    }

    else if(process.env.NODE_ENV === 'production') {
        let error = err
        if(error.name === 'CastError')  error = handleDBCastError(err);
        if(error.name === 'ValidationError')   error = handleDBValidationError(err);
        sendProductionError(error, res);
    }
}

exports.catchAsyncErrors = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}