import express from 'express'
import helmet from 'helmet'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'
import xss from 'xss-clean'


import AppError from './utils/appError'
import globalErrorHandler from './controllers/errorController'

const app = express()

const limit = rateLimit({
    max:100,
    windowMs: 60 * 60 * 1000,
    message:'Too many requests from your IP !'
})

app.use('/api',limit)
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(express.static(`${__dirname}/public`))
app.use(mongoSanitize())
app.use(xss())

app.all('*',(req, res, next)=>{
    const error = new AppError('Route not found !',404)
    next(error)
})
app.use(globalErrorHandler)
export default app