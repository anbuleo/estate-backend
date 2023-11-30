import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from  'jsonwebtoken'

let SALT = process.env.SALT
export const signup = async(req,res,next) => {

    const { username, email, password} = req.body
    let user = await User.findOne({email:req.body.email})
    const hashedPassword = bcryptjs.hashSync(password,SALT)
    let newUser = new User({username,email,password:hashedPassword})
    
   try {
       
    await newUser.save()   
        res.status(201).send({
            message: 'User created successfully!!!',
            newUser
        })
       
           
          
   } catch (error) {
    
    next(error)
   }
    
}

export const signIn = async (req,res,next) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        console.log(user)
        if(!user) return next(errorHandler(404, 'User Not Found!'));
        const validPassword = bcryptjs.compareSync(password,user.password);
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials!'))
        const token=jwt.sign({id : user._id},process.env.JWT_SECRET);
        const { password: pass, ...rest} = user._doc
        res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}