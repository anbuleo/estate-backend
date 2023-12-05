import ListingModel from "../models/list.model.js"


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