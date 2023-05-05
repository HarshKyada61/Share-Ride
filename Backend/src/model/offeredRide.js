import mongoose from 'mongoose';

const OfRideSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    StartPoint: {
        type: [Number],
        required: true,
    },
    EndPoint: {
        type: [Number],
        required: true,
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    distance:{
        type:Number,
        required: true
    },
    duration:{
        type:String,
        required:true
    },
    Route:{
        type:[[Number]],
        required:true
    },
    AvailableSeats:{
        type:Number,
        default:1
    },
    Status:{
        type:String,
        default:'waiting'
    }
},{
    timestamps: true
})

const OfferedRide = mongoose.model('OfferedRide', OfRideSchema)

export default OfferedRide