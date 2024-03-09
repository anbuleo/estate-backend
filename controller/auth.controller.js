import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import { errorHandler } from '../utils/error.js'
import jwt from  'jsonwebtoken'
import otpGenerator from "otp-generator"
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'

let SALT = process.env.SALT


let nodeConfig = {
    host: "smtp.ethereal.email",
    port: 587,
  secure: false, //
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
}
}
let transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user:  process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})
let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

export const signup = async(req,res,next) => {

    const { username, email, password} = req.body
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const hashedPassword = bcryptjs.hashSync(password,Number(SALT))
    let newUser = new User({username,email,password:hashedPassword})
    
    // let config = {
    //     service : 'gmail',
    //     auth : {
    //         user: process.env.EMAIL,
    //         pass: process.env.PASSWORD
    //     }
    // }

    // let transporter = nodemailer.createTransport(config);

    // let MailGenerator = new Mailgen({
    //     theme: "default",
    //     product : {
    //         name: "Mailgen",
    //         link : 'https://mailgen.js/'
    //     }
    // })
    
    // let response = {
    //     body: {
    //         name : username,
    //         intro:  "'Welcome to our website! We\'re very excited to have you on board.'",
            
    //         outro: "you have trouble? Just reply to this email, we\'d love to help."
    //     }
    // }

    // let mail = MailGenerator.generate(response)

    // let message = {
    //     from : process.env.EMAIL,
    //     to : email,
    //     subject:  "welcome",
    //     html: mail
    // }

    // transporter.sendMail(message).then(() => {
    //     return res.status(201).json({
    //         msg: "you should receive an email"
    //     })
    // })
    
   try {
       
    await newUser.save() 
    let user = await User.findOne({email:req.body.email}) 
    if(user){
        const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
    const {password:pass, ...rest} = user._doc
    res.cookie('access_token', token, {
        httpOnly: true, // The cookie cannot be accessed through client-side scripts
        secure: true, // Send the cookie only over HTTPS (in a production environment)
        sameSite: 'Strict', // Protect against CSRF attacks
        expires: new Date(Date.now() + 3600000), // Cookie expiration time (1 hour in milliseconds)
      }).status(201).json(rest)
    // res.cookie('access_token',token,{httpOnly:false}).status(201).json(rest)

    }
        // if(user){
        //     res.status(201).send({
        //         message: 'User created successfully!!!',
        //         newUser,
        //         user
        //     })
        //     return
        // }
       
           
          
   } catch (error) {
    console.log(error)
    next(error)
   }
    
}

export const signIn = async (req,res,next) => {
    const {email, password} = req.body
        // console.log(email,req.body)
    try {
        const user = await User.findOne({email})
        // console.log(user)
        if(!user) return next(errorHandler(404, 'User Not Found!'));
        const validPassword = bcryptjs.compareSync(password,user.password);
        if(!validPassword) return next(errorHandler(401,'Wrong Credentials!'))
        const token=jwt.sign({id : user._id},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE
        });
        const { password: pass, ...rest} = user._doc
        res.cookie('access_token', token, {
    httpOnly: true, // The cookie cannot be accessed through client-side scripts
    secure: true, // Send the cookie only over HTTPS (in a production environment)
    sameSite: 'Strict', // Protect against CSRF attacks
    expires: new Date(Date.now() + 3600000), // Cookie expiration time (1 hour in milliseconds)
  }).status(200).json(rest)
        // res.cookie('access_token',token,{httpOnly:true}).status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

export const google = async (req,res,next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if(user){
            const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
            const {password:pass, ...rest} = user._doc
            res.cookie('access_token', token, {
                httpOnly: true, // The cookie cannot be accessed through client-side scripts
                secure: true, // Send the cookie only over HTTPS (in a production environment)
                sameSite: 'Strict', // Protect against CSRF attacks
                expires: new Date(Date.now() + 3600000), // Cookie expiration time (1 hour in milliseconds)
              }).status(200).json(rest)
            
            //res.cookie('access_token',token,{httpOnly:false,sameSite: 'none',secure:true}).status(200).json(rest)
           
        }
        else{
            const generatedPassword =Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword,SALT);
            const newUser = new User({username:req.body.name.split(" ").join('').toLowerCase()+Math.random().toString(36).slice(-4), email:req.body.email,password:hashedPassword,avatar: req.body.photo})
            await newUser.save()
            const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
            const {password:pass, ...rest} = user._doc
            res.cookie('access_token', token, {
                httpOnly: true, // The cookie cannot be accessed through client-side scripts
                secure: true, // Send the cookie only over HTTPS (in a production environment)
                sameSite: 'Strict', // Protect against CSRF attacks
                expires: new Date(Date.now() + 3600000), // Cookie expiration time (1 hour in milliseconds)
              }).status(200).json(rest)

            // res.cookie('access_token',token,{httpOnly:false,sameSite: 'none',secure:true}).status(200).json(rest)

        }
    } catch (error) {
        next(error)
    }
}

export const signOut = async(req,res,next)=>{

    try {
        res.clearCookie('access_token')
        res.status(200).json('User has been logged Out')
        
    } catch (error) {
        next(error)
    }
}

/// Set the token as a cookie
//   res.cookie('jwt', token, {
//     httpOnly: true, // The cookie cannot be accessed through client-side scripts
//     secure: true, // Send the cookie only over HTTPS (in a production environment)
//     sameSite: 'Strict', // Protect against CSRF attacks
//     expires: new Date(Date.now() + 3600000), // Cookie expiration time (1 hour in milliseconds)
//   });