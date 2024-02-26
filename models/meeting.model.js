import mongoose from 'mongoose'


const MeetingSchema = new mongoose.Schema({
    subject:{
        type:String,
        required:true
    },
    date:{
        type:String,
        required:true
    },
    userIds:{
        type:Array,
        required:true
    },
    url:{
        type:String,
        required:true
    },
    userEmails:{
        type:Array,
        required:true
    },
    createdAt: Date,
},{
    timestamps:true
})

const Meeting = mongoose.model('meeting',MeetingSchema)

export default Meeting