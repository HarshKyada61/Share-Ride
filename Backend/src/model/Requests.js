import mongoose from 'mongoose';

const RequestsSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    RequestedTo: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    OwnRide:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Ride'
    },
    RequestedRide:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'OfferedRide'
    },
    Status:{
        type:String,
        default:'Requested'
    }
},{
    timestamps: true
})

const Requests = mongoose.model('Request', RequestsSchema)

export default Requests