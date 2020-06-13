import * as HttpStatus from 'http-status-codes'
import * as _ from 'lodash'

export default class Response {
    static success(res, message, data = null, code = HttpStatus.OK, extra = {}) {
        const responseObj = { success: true }
        responseObj['message'] = message || 'success';
        responseObj['data'] = data || null;
        responseObj['statusCode'] = code || HttpStatus.OK;
        responseObj['extra'] = extra || {};

        res.status(responseObj.statusCode).json(responseObj)
    }

    static fail(res, message, code = HttpStatus.NOT_FOUND, extra = {}) {
        const responseObj = { success: false }
        responseObj['message'] = message || 'failed';
        responseObj['statusCode'] = code || HttpStatus.NOT_FOUND;
        responseObj['extra'] = extra || {};

        res.status(responseObj.statusCode).json(responseObj)
    }
}