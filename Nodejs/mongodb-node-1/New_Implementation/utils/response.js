import * as HttpStatus from 'http-status-codes'
import * as _ from 'lodash'

export default class Response {
    static success(res, message, data = null, code = HttpStatus.OK, extra = {}) {
        const responseObj = {success: true}
        responseObj['status'] = 'success';
        responseObj['message'] = message || '';
        responseObj['data'] = data || null;
        responseObj['statusCode'] = code || HttpStatus.OK;
        responseObj['extra'] = extra || {};

        res.status(responseObj.statusCode).json(responseObj)
    }

    static fail(res, message, code = HttpStatus.NOT_FOUND, extra = {}) {
        const responseObj = {success: false}
        responseObj['status'] = 'success';
        responseObj['message'] = message || '';
        responseObj['statusCode'] = code || HttpStatus.NOT_FOUND;
        responseObj['extra'] = extra || {};

        res.status(responseObj.statusCode).json(responseObj)
    }

    static error(res, message, errorObj, code = HttpStatus.NOT_FOUND) {
        res.status(code).json({
            status: 'error',
            code: code,
            message: message || '',
            error:{...errorObj},
            // val : Object.values(errorObj.errors)
        })
    }
}