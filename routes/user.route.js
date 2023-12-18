import express from 'express'
import userController from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();


router.get('/test',userController.test)
router.post('/update/:id',verifyToken,userController.updateUser)
router.delete('/delete/:id',verifyToken,userController.deleteUser)
router.get('/listing/:id', verifyToken,userController.getUserListing)

export default router