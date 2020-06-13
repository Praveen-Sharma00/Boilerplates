import {config} from 'dotenv'

import mongoose from 'mongoose'

import app from "./app";

(async ({env})=>{
    config({
        path: './config.env'
    })
    try{
        await mongoose.connect(env.DB_URL, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        console.log('DB Connection established sucessfully !')
    }catch(e){
        console.log('Failed to establish DB Connection !')
    }
})(process)

app.listen(process.env.PORT , ()=>{
    console.log('Server listening on PORT : '+process.env.PORT)
})