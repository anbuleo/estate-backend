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

export const getListings = async(req,res,next)=>{
    try {
        const limit = parseInt(req.query.limit) || 9;
        const startIndex = parseInt(req.query.startIndex) || 0;
        let offer = req.query.offer;
        if(offer===undefined || offer === 'false'){
            offer = {$in:[false,true]}
        } 
        let furnished = req.query.furnished
        if(furnished === undefined || furnished === 'false'){
            furnished = {$in:[false,true]}
        }
        let parking = req.query.parking
        if(parking=== undefined || parking ==='false'){
            parking = {$in:[false,true]}
        }
        let type = req.query.type
        if(type === undefined || type === 'all'){
            type={ $in:['sale','rent']}
        }
        const searchTerm = req.query.searchTerm || ''
        const sort = req.query.sort || 'createdAt';
        const order = req.query.order || 'desc';

        const listings = await ListingModel.find({
            name: {$regex: searchTerm, $options: 'i'},
            offer,
            furnished,
            parking,
            type
        }).sort({[sort]:order}).limit(limit).skip(startIndex)
        return res.status(200).json(listings)

    } catch (error) {
        next(error)
    }
}