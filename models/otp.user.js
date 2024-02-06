import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    
    role:{
        type : String,
        default:'customer'
    },
    email:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    otpcode:{
        type:String
    },
    ref:{
        type:String,
        required:true
    },
    createdAt: Date,
    expiresAt: Date
},{
    timestamps : true
}
)

const Otp = mongoose.model('otp',OtpSchema)

export default Otp