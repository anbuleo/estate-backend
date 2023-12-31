import ListingModel from "../models/list.model.js"
import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'




const test = async(req,res)=>{
    res.send({
        message : "hello"
    })
}

const  updateUser = async(req,res,next) => {
    // console.log(req.user,req.params.id)
    if(req.user.id !== req.params.id){
        return next(errorHandler(401,'You can only update your own account!'))
    }
    try {
        // console.log( req.body.password )
       
        if (req.body.password) {
            req.body.password =  bcryptjs.hashSync(req.body.password, 10);
            
          }

        
        
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set : {
                username : req.body.username,
                email : req.body.email,
                password : req.body.password ,
                avatar : req.body.avatar,
            },
        },{new : true})
        // console.log(updatedUser)
        const {password, ...rest} = updatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

const deleteUser = async(req,res,next) => {
    if(req.user.id !== req.params.id) return next(errorHandler(401, 'You can only delete your own account '))
    try {
        await User.findByIdAndDelete(req.params.id)
        res.clearCookie('access_token')
        res.status(200).json('user has been deleted')
    } catch (error) {

        next(error)
    }
}
const getUserListing = async(req,res,next) => {

    if(req.user.id === req.params.id){
        try {
            const listing = await ListingModel.find({userRef : req.params.id})
            if(listing){
                res.status(200).json(listing)
            }
        } catch (error) {
            next(error)
        }
    }else{
        return next(errorHandler(401,'You can only view your own listings'))
    }
}




export default {
    test,
    
    updateUser,
    deleteUser,
    getUserListing   
}