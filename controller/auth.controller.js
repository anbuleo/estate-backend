import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'

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