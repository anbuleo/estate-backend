import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js';


export const verifyToken = (req,res,next) => {
    let tokens = req.get('cookie').split("=")[1] //another way of parser the cookie in req
    
    const token = req.cookies.access_token; // after installed npm package npm i cookie-parser
    console.log(token,tokens)

    
    if(!token) return next(errorHandler(401, 'Unauthorised'))

    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(403,'Forbidden'))
        req.user = user
    
        next()
    })
}