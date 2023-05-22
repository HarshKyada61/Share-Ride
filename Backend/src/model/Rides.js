import mongoose from 'mongoose';

const RideSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    pickUpPoint: { 
        cords:{
            type: [Number],
            required: true,
        },
        place_name:{
            type:String,
            required: true
        }
    },
    DropPoint: {
        cords:{
            type: [Number],
            required: true,
        },
        place_name:{
            type:String,
            required: true
        }
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
    Status:{
        type:String,
        default:'Searching'
    },
    OfferedRide:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OfferedRide'
    },
    OTP:{
        type: Number
    },
    TotalFare:{
        type: Number,
        required: true
    }
},{
    timestamps: true
})

const Ride = mongoose.model('Ride', RideSchema)

export default Ride