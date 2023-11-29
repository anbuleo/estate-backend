import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'


dotenv.config()

let PORT  = process.env.PORT
let db_url = process.env.DB_URL
let db_name = process.env.DB_NAME

try {
    mongoose.connect(`${db_url}/${db_name}`)
    console.log('DataBase connected Successfully')
} catch (error) {
    console.log(error)
}

//create the app


const app = express()


app.use('/user',userRouter)

app.listen(PORT,() => {
    console.log(`Server is Running on port ${PORT}`)
})