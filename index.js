import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.route.js'
import authRouter from './routes/auth.route.js'
import otpRouter from './routes/otp.route.js'
import listingRouter from './routes/list.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'


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

app.use(express.json())
app.use(cookieParser())
app.use(cors())


app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/listing',listingRouter)
app.use('/api/otp',otpRouter)

app.listen(PORT,() => {
    console.log(`Server is Running on port ${PORT}`)
})

//middleware

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success : false,
        statusCode,
        message
    })
})