import express from 'express'
import userController from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
import { registerMail, generateOtps,verifyOTP, getUsers, registerMailMeetings, getMeetingslist } from '../controller/otp.mailer.js';

const router = express.Router();


router.get('/test',userController.test)
router.post('/update/:id',verifyToken,userController.updateUser)
router.delete('/delete/:id',verifyToken,userController.deleteUser)
router.get('/listing/:id', verifyToken,userController.getUserListing)
router.get('/:id',verifyToken,userController.getUser)
router.post('/registermail',registerMail)
router.get('/genrateotp',generateOtps)
router.get('/verifyotp',verifyOTP)
router.get('/getuser/:username',getUsers)
router.get('/getalluser',userController.totalotp)
router.post('/createMeeting',registerMail)
router.get('/get/allmeeting',getMeetingslist)

export default router