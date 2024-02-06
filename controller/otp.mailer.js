import otpGenerator from "otp-generator"
import User from '../models/user.model.js'


import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import Otp from "../models/otp.user.js"
import {generateOTP} from "../utils/generateotp.js"

// https://ethereal.email/create

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
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: 'gmail',//
  auth: {
    type: "OAUTH2",
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  }
})
transporter.verify((error,success)=>{
    if(error){
        console.log(error)
    }else{
        console.log(success,'Ready for message')
    }
})
const sendEmails = async(mailOptions)=>{
    try {
        await transporter.sendMail(mailOptions)
        return
    } catch (error) {
        console.log(error)
    }
}



let MailGenerator = new Mailgen({
    theme: "default",
    product : {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})













export const getUsers = async(req,res) =>{
    try {
        let username=req.params.username
        console.log(username)
        let user  = await User.findOne({username})
        if(user){
            res.status(200).json(user)
        }

       
    } catch (error) {
        console.log(error)
    }
}

export const registerMail = (req, res) => {

    // const { userEmail } = req.body;
    const { username, userEmail, text, subject } = req.body;
    console.log(req.body)

    let config = {
        service : 'gmail',
        auth : {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Mailgen",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name : username,
            intro: text || "'Welcome to our website! We\'re very excited to have you on board.'",
            
            outro: "you have trouble? Just reply to this email, we\'d love to help."
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : process.env.EMAIL,
        to : userEmail,
        subject: subject || "welcome",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("getBill Successfully...!");
}



export const generateOtps =  async (req,res)=>{
    

    
    req.app.locals.OTP = await otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    console.log( req.app.locals.OTP)
    res.status(201).send({ code: req.app.locals.OTP })
}
export async function verifyOTP(req,res){
    console.log(req.app.locals.OTP,req.query)
    const { code } = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt( req.query.code)){
        req.app.locals.OTP = null; // reset the OTP value
        req.app.locals.resetSession = true; // start session for reset password
        return res.status(201).send({ msg: 'Verify Successsfully!'})
    }
    return res.status(400).send({ error: "Invalid OTP"});
}

export const newVerifyOtp = async (req,res)=>{
    try {
        const {email,subject,message,duration} = req.body
    } catch (error) {
        
    }
}

const sendOTP = async({email,subject,message,duration=1})=>{
    try {
        if(!(email && subject && message)){
                throw Error('Provide values for email, subject, message')
        }
                await Otp.deleteOne({email})
                const generatedOTP = await generateOTP()
                const mailOptions = {
                    from:process.env.EMAIL ,
                    to:email,
                    html:`<p>${message}</p><p style='color:tomato; font-size:250px; letter-spacing:2px'><b>${generatedOTP}</b></p><p>This code <b>expires in ${duration} hour(s)</b>.</p>`
                }
                await sendEmails(mailOptions)
        
    } catch (error) {
        
    }
}