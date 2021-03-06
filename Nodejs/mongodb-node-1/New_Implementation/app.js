import express from 'express'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import xss from 'xss-clean'
import mongoSanitize from 'express-mongo-sanitize'

import AppError from './utils/appError'
import globalErrorHandler from './controllers/errorController'

import authRoutes from './routes/authRoutes'
const app = express()

const limit = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 100,
    message: 'Too many request from your IP !'
})
app.use('/api', limit)
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(`${__dirname}/public`))
app.use(mongoSanitize())
app.use(xss())

app.use('/api/v1/auth', authRoutes)
app.all('*',(req, res,next) => {
    return next(new AppError('Route not found !',404))
})
app.use(globalErrorHandler)
export default app;

