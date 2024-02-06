import express from 'express'
import { generateOtps, newVerifyOtp, verifyOTP } from '../controller/otp.mailer.js'
import userController from '../controller/user.controller.js'
const router = express.Router()

router.get('/genrateotp',generateOtps)
router.get('/verifyotp',verifyOTP)
router.get('/getuser/:id',userController.getUser)
router.get('/getalluserotp',userController.getAllOtps)
router.post('/create-otplist',userController.createOtpReg)



export default router