import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'

let SALT = process.env.SALT
export const signup = async(req,res) => {

    const { username, email, password} = req.body
    let user = await User.findOne({email:req.body.email})
    const hashedPassword = bcryptjs.hashSync(password,SALT)
    
   try {
        if(!user ) {
            let newUser = new User({username,email,password:hashedPassword})
        res.status(201).send({
            message: 'User created successfully!!!',
            newUser
        })
       await newUser.save()
           
        }else{
            res.status(400).send({
                message : 'This email already register',

            })
        }    
   } catch (error) {
    console.log(error)
    next(error)
   }
    
}