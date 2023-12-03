import jwt from 'jsonwebtoken'
import { errorHandler } from './error.js';


export const verifyToken = (req,res,next) => {
    let token = req.get('cookie').split("=")[1]
    
    // const token = req.cookie.access_token;
    
    if(!token) return next(errorHandler(401, 'Unauthorised'))

    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err) return next(errorHandler(403,'Forbidden'))
        req.user = user
    
        next()
    })
}