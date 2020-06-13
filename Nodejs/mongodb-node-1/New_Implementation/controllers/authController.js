import * as HttpStatus from 'http-status-codes'

import asyncHandler from '../utils/asyncHandler'
import Response from '../utils/response'

const registerUser = asyncHandler((req, res, next) => {
    Response.success(res, 'Route working successfully')
})

const loginUser = asyncHandler((req, res, next) => {
    Response.success(res, 'Route working successfully')
})

export const AuthController = {
    registerUser, loginUser
}


