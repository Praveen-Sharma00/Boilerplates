const AppError = require('./utils/appError');

const sendDevError = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        stack: err.stack,
    })
}
const sendProdError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        res.status(err.statusCode).json({
            status: 'error',
            message: 'Some error occurred on server'
        })
    }
}
const handleCastError = err => {
    const message = `Invalid ${err.path} : ${err.value}.`;
    return new AppError(message, 400);
}

const handleDuplicateError = err => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
    const message = `Duplicate field value :${value}. Use another value`;
    return new AppError(message, 400);
}

const handleValidationError = err => {
    const errors = Object.values(err.errors).map(e => e.message);
    const message = `Invalid input data . ${errors.join('. ')}`;
    return new AppError(message, 400);
}


module.exports = (err, req, res, next) => {
    if (process.env.NODE_ENV !== 'development') {
        sendDevError(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err };

        if (error.name === 'CastError') {
            error = handleCastError(err);
        }
        if (error.code === 11000) {
            error = handleDuplicateError(err);
        }
        if (error.name === 'ValidationError') {
            error = handleValidationError(err);
        }

        sendProdError(error, res);
    }
}