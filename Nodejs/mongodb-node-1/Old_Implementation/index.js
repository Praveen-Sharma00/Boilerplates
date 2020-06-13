const dotenv = require('dotenv')
dotenv.config({
    path: './config.env'
})
const mongoose = require('mongoose')
mongoose
    .connect(process.env.DB_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('DB Connection established !')
    }, (err) => {
        console.log('Error establishing DB connection !')
        process.exit()
    })

const app = require('./app')

const server = app.listen(process.env.PORT,()=>{
    console.log('Server listening on port ' + process.env.PORT)
})

process.on('unhandledRejection',err=>{
    console.log(err.name , err.message)
    console.log('UNHANDLED_REJECTION ! , Shutting Down...')
    server.close(()=>{
        process.exit(1)
    }) 
})
process.on('uncaughtException',err=>{
    console.log(err.name , err.message)
    console.log('UNCAUGHT_EXCEPTION ! , Shutting Down...')
    server.close(()=>{
        process.exit(1)
    }) 
})