export default class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.message = message || 'Some error occurred'
        this.statusCode = statusCode || 500
        this.status = `${statusCode}`.startsWith("4") ? 'fail' : 'error'
        this.isOperational = true
        Error.captureStackTrace(this, this.constructor)
    }
}