import AppError from '../utils/appError'

const handleDuplicateError = (res, err) => {
    let path = Object.keys(err['keyValue'])[0]
    let value = err['keyValue'][path]
    err = new AppError(`${value} is already associated with another account`)
    return res.json({
        message: err.message,
        error: {
            type: 'DuplicateError',
            detail: [{
                path, value
            }]
        },
        status: 'fail'
    })
}
const handleValidationError = (res, err) => {
    let errorList = Object.values(err.errors)
    let processedList = errorList.map((e) => {
        if (e['kind'] === 'minlength') {
            return {
                path: e['path'],
                kind: e['kind'],
                message: `${e['path']} should atleast have ${e['properties']['minlength']} characters `,
                minlength: e['properties']['minlength'],
                value: ''
            }
        } else if (e['kind'] === 'user defined') {
            return {
                path: e['path'],
                kind: e['kind'],
                message: `${e['properties']['message']} `,
                value: e['value']
            }
        }
    })
    return res.json({
        message: 'Invalid data provided',
        error: {
            type: 'ValidationError',
            detail: processedList
        },
        status: 'fail'
    })
}
const handleCastError = (res, err) => {
    let path = err['path']
    let value = err['path']
    return res.json({
        message: 'Invalid data provided',
        error: {
            type: 'CastError',
            detail: [{
                path, value
            }]
        },
        status: 'fail'
    })
}


const sendDevError = (res, err) => {
    return res.json({
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        stack: err.stack,
        err: err,
    })
}
const sendProdError = (res, err) => {
    if (err.name === 'CastError') {
        return handleCastError(res, err)
    } else if (err.hasOwnProperty('code') && err['code'] === 11000) {
        return handleDuplicateError(res, err)
    } else if (err.hasOwnProperty('errors')) {
        return handleValidationError(res, err)
    } else if (err.isOperational) {
        return res.json({
            message: err.message,
            statusCode: err.statusCode,
            status: 'fail'
        })
    } else {
        return res.json({
            message: 'Internal server error',
            status: 'error',
            statusCode: 500
        })
    }
}

export default function (err, req, res, next) {
    if (process.env.NODE_ENV === 'development') {
        sendDevError(res, err)
    } else if (process.env.NODE_ENV === 'production') {
        sendProdError(res, err)
    }
}