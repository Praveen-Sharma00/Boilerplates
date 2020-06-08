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
app.listen(process.env.PORT,()=>{
    console.log('Server listening on port ' + process.env.PORT)
})
