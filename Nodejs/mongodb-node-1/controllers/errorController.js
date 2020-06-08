const AppError = require('../utils/appError')

const handleCastError = (error) => {
    const message = `Invalid ${error.path} : ${error.value}.`
    return new AppError(message, 400)
}

const handleValidationError = (error) => {
    const errors = Object.values(error.errors).map(e => e.message)
    const message = `Invalid input data ${errors.join('. ')}.`
    return new AppError(message, 400)
}

const handleDuplicateError = (error) => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    const message = `Duplicate field value : ${value}. Please use another `
    return new AppError(message, 400)
}


const sendDevError = (err, res) => {
    return res
        .status(err.statusCode)
        .json({
            status: err.status,
            message: err.message,
            stack: err.stack,
        })
}
const sendProdError = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode)
            .json({
                message: err.message,
                status: err.status
            })
    } else {
        res.status(500).json({
            message: 'Error occurred on server',
            status: 'error'
        })
    }
}


module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'


    if (process.env.NODE_ENV === 'development') {
        sendDevError(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        let error = { ...err }
        if (err.name === 'ValidationError')
            error = handleValidationError(err)
        else if (err.name === 'CastError')
            error = handleCastError(err)
        else if (err.code === 11000)
            error = handleDuplicateError(err)

        sendProdError(err, res)
    }

}