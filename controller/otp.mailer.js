import otpGenerator from "otp-generator"
import User from '../models/user.model.js'


import nodemailer from 'nodemailer'
import Mailgen from 'mailgen'
import Otp from "../models/otp.user.js"
import {generateOTP} from "../utils/generateotp.js"
import Meeting from "../models/meeting.model.js"

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
        // console.log(username)
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
    // const { userIds, userEmails, date, subject,url } = req.body;
    const {userIds,userEmails, username, userEmail, text, subject,date ,url} = req.body;
    // console.log(req.body)

   try{ let config = {
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
    if(username){
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
        })
    }
    else if(userIds){
        let a = date.split('T')

    let b= a[0]
    let c = a[1]
    

      let response = {
        body: {
            subject : subject,
            intro:  `<div>Your<strong> ${subject} </strong>Meeting schedule  on  <b>${b}</b> at time <b>${c} </b><br/><p style="text-center; padding:10px"> <button  style ="background-color: #008CBA;  border: none;
            color: white;
            padding: 15px 32px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            border-radius: 8px;" ><a style="text-decoration:none; color:white;  text-align: center;" href=${url} >Join</a></button></p><br/><br/>
            <p>Meeting join link here: ${url}</p></div>`,
            
            outro: "you have trouble? Just reply to this email, we\'d love to help."
        }
    }

    let mail = MailGenerator.generate(response)
    for (const email of userEmails) {
        // console.log(email)
        // nodemailerMailgun.sendMail({
        //   from: 'myemail@example.com',
        //   to: email,
        //   subject: 'Event Invitation',
        //   html: renderToString(<InvitationEmail from="myemail@example.com" to={email} eventId={eventId} />)
        // })
        transporter.sendMail({
            from : process.env.EMAIL,
            to: email,
            subject:subject,
            html: mail
        }).then(async() => {
           if(email == userEmails[Number(userEmails.length -1)]){
            let newres = await Meeting.create(req.body)
            
            return res.status(201).json({
                msg: "you should receive an email"
            })
           }
           
        }).catch(error => {
            console.log(error)
            return res.status(500).json({ error })
        })
      
      }
   
    }
}
    catch(error) {
        console.log(error)
        return res.status(500).json({ error })
    }

    // res.status(201).json("getBill Successfully...!");
}
export const registerMailMeetings = (req, res) => {

    // const { userEmail } = req.body;
   
    console.log(req.body)
    
        
       
    let config = {
        service : 'gmail',
        auth : {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    }
    // console.log(req.body)


    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Mailgen",
            link : 'https://mailgen.js/'
        }
    })
    let a = date.split('t')[0]
    let b= date.split('t')[1]
    let time
    function tConvert (time) {
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
      
        if (time.length > 1) { // If time format correct
          time = time.slice (1);  // Remove full string match value
          time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
          time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        return time.join (''); // return adjusted time or original string
      }
      
      tConvert (b)

      let response = {
        body: {
            subject : subject,
            intro:  `Your Meeting on  ${a} at time ${time}`,
            
            outro: "you have trouble? Just reply to this email, we\'d love to help."
        }
    }

    let mail = MailGenerator.generate(response)
   
       
   
        let message = {
            from : process.env.EMAIL,
            to : mailsId,
            subject: subject || "welcome",
            html: mail
        }
        for (const email of userEmails) {
            console.log(email)
            // nodemailerMailgun.sendMail({
            //   from: 'myemail@example.com',
            //   to: email,
            //   subject: 'Event Invitation',
            //   html: renderToString(<InvitationEmail from="myemail@example.com" to={email} eventId={eventId} />)
            // })
            transporter.sendMail({
                from : process.env.EMAIL,
                to: email,
                subject:subject,
                html: mail
            }).then(() => {
                return res.status(201).json({
                    msg: "you should receive an email"
                })
            }).catch(error => {
                console.log(error)
                return res.status(500).json({ error })
            })
          
          }
        // transporter.sendMail({
        //     from : process.env.EMAIL,
        // }).then(() => {
        //     return res.status(201).json({
        //         msg: "you should receive an email"
        //     })
        // }).catch(error => {
        //     return res.status(500).json({ error })
        // })

    // transporter.sendMail(message).then(() => {
    //     return res.status(201).json({
    //         msg: "you should receive an email"
    //     })
    // }).catch(error => {
    //     return res.status(500).json({ error })
    // })

    // res.status(201).json("getBill Successfully...!");
    console.log(req.body)

}


export const generateOtps =  async (req,res)=>{
    

    
    req.app.locals.OTP = await otpGenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false})
    // console.log( req.app.locals.OTP)
    res.status(201).send({ code: req.app.locals.OTP })
}
export async function verifyOTP(req,res){
    // console.log(req.app.locals.OTP,req.query)
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

export const getMeetingslist =async(req,res,next)=>{
    try {
        let data = await Meeting.find()
        if(data){
            res.status(200).json(data)
        }
        
        // console.log(data)
    } catch (error) {
        console.log(error)
        next(error)
    }
}