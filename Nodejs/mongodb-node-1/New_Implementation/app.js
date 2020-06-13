import express from 'express'
import helmet from 'helmet'
import * as rateLimit from 'express-rate-limit'
import * as xss from 'xss-clean'
import * as mongoSanitize from 'express-mongo-sanitize'


const app = express()

app.use('/api',rateLimit({
    windowMs:60*60*1000,
    max:100,
    message:'Too many request from your IP !'
}))
app.use(helmet)
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`))
app.use(mongoSanitize())
app.use(xss())


export default app;

