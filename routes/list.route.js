import express from 'express'
import { createListing, deleteListing, getListing, getListings, updateListing } from '../controller/list.controller.js'
import { verifyToken } from '../utils/verifyUser.js'

const router = express.Router()

router.post('/create',verifyToken,createListing)
router.delete('/deletelist/:id',verifyToken,deleteListing)
router.post('/update/:id',verifyToken,updateListing)
router.get('/getListing/:id',getListing)
router.get('/getlistings',getListings)

export default  router