const AppError = require('../utils/appError')

const handleCastError = (error) => {
    const message = `Invalid ${error.path} : ${error.value}.`
    return new AppError(message, 400)
}

const handleValidationError = (error) => {
    let errors = Object.values(error.errors)
    const msg = errors.map((e) => {
        if (e.hasOwnProperty('kind') && e['kind'] === 'required') {
            return e['path'] + ' is a required field !'
        }
        return e['properties']['message']
    })
    const message = `${msg.join('. ')}`
    return new AppError(message, 400)
}

const handleDuplicateError = (err) => {
    const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0]
    const message = `Duplicate field value : ${value}. Please use another `
    return new AppError(message, 400)
}

const handleJWTError = () => {
    return new AppError("Invalid token. Please login", 401)
}

const handleTokenExpiredError = () => {
    return new AppError("Token is expired. Please login", 401)
}

const sendDevError = (err, res) => {
    return res
        .status(err.statusCode)
        .json({
            err: err,
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
        if (err.hasOwnProperty('errors') || err.name === 'ValidationError')
            err = handleValidationError(err)
        else if (err.hasOwnProperty("name") && err.name === 'CastError')
            err = handleCastError(err)
        else if (err.hasOwnProperty("code") && err.code === 11000)
            err = handleDuplicateError(err)
        else if (err.name === 'JsonWebTokenError')
            err = handleJWTError()
        else if (err.name === 'TokenExpiredError')
            err = handleTokenExpiredError()
        sendProdError(err, res)
    }

}