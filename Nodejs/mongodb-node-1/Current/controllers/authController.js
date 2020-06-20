import UserModel from '../models/UserModel'

import asyncHandler from '../utils/asyncHandler'

const registerUser = asyncHandler(async (req, res, next) => {
    const newUser = new UserModel({
        name: req.body['name'],
        email: req.body['email'],
        photo: req.body['photo'],
        password: req.body['password'],
        passwordConfirm: req.body['passwordConfirm']
    })
    await newUser.save()
    return res.status(200).json({
        message: 'done'
    })
})

const AuthController = {
    registerUser,
}
export default AuthController