const AppError = require('../utils/appError')

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have access to this !', 403));
        }
        next()
    }
}

module.exports = {
    restrictTo
}