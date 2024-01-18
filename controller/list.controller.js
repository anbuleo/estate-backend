import ListingModel from "../models/list.model.js"
import { errorHandler } from "../utils/error.js"


export const createListing = async (req,res,next) => {
    try {
        const listing = await ListingModel.create(req.body)
        res.status(201).send({
            listing
        })
    } catch (error) {
        next(error)
    }

}
export const deleteListing = async (req,res,next) => {
   
       
        
        const listing = await ListingModel.findById(req.params.id)
       

        if(!listing){
            return next(errorHandler(404,'Listing not found'))
        }
        if(req.user.id !== listing.userRef){
        //    console.log(listing)
            return next(errorHandler(401,'You can delete your own listings'))
        }
        try {
            await ListingModel.findByIdAndDelete(req.params.id)
            res.status(200).json('Listing has been deleted')

    } catch (error) {
        next(error)
    }
}
export const updateListing = async(req,res,next)=>{
    const listing = await ListingModel.findById(req.params.id)
    if(!listing){
        return next(errorHandler(404,'List not found'))
    }
    if(req.user.id !== listing.userRef){
        //    console.log(listing)
            return next(errorHandler(401,'You can delete your own listings'))
        }
        try{
            const upadtedListing = await ListingModel.findByIdAndUpdate(
                req.params.id,
                req.body,
                {new : true}
            )
            res.status(200).json(upadtedListing)

        }catch(error){
            next(error)
        }
}

export const getListing = async (req,res,next) => {
    try {
    const listing = await ListingModel.findById(req.params.id)
   
    if(!listing){
        return next(errorHandler(404,'List not found'))
    }
    res.status(200).send({
        message: 'The listing got successfull',
        listing
    })       
        
    } catch (error) {
        next(error)
    }
}