import {config} from 'dotenv'
import mongoose from 'mongoose'

(async ({env}) => {
    config({
        path: './config.env'
    })

    const DB_URI = env.NODE_ENV === 'development' ?  env.DB_PROD_URI:env.DB_LOCAL_URI
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('DB connection established !')
    } catch (err) {
        console.log('Error connecting to database !')
        process.exit(1)
    }
})(process)


import app from './src/app'

app.listen(process.env.PORT, () => {
    console.log('Server listening on port ' + process.env.PORT)
})

