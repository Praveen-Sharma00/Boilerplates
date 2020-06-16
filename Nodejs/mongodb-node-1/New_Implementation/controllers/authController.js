import UserModel from '../models/UserModel'

import asyncHandler from '../utils/asyncHandler'
import Response from '../utils/response'

const registerUser = asyncHandler(async (req, res, next) => {
    await UserModel.create({
        name: req.body['name'],
        email: req.body['email'],
        password: req.body['password'],
        passwordConfirm: req.body['passwordConfirm'],
        photo: req.body['photo'],
    })
    return Response.success(res, 'User account created successfully !')
})

const loginUser = asyncHandler((req, res, next) => {
    Response.success(res, 'Route working successfully')
})

export const AuthController = {
    registerUser, loginUser
}


