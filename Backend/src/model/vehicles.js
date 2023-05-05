import mongoose from 'mongoose';


const VehicleSchema = new mongoose.Schema({
    VehicleNo:{
        type:String,
        required: [true,'Vehicle Number is Required'],
    },
    Type: {
        type:String,
        required:[true,'type is Required'],
        enum:{
            values:["2-Wheeler", "4-Wheeler"],
            message: "{VALUE} is not supported"
        }
    },  
    ModelName:{
        type:String,
        required:[true,'ModelName is Required'],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps: true
})


VehicleSchema.methods.toJSON = function () {
    const vehicle = this
    const vehicleObject = vehicle.toObject()

    delete vehicleObject.createdAt
    delete vehicleObject.updatedAt
    delete vehicleObject.__v
    delete vehicleObject.user
    return vehicleObject
}

VehicleSchema.pre('save', async function (next) {
    const vehicle = this
  
    if(vehicle.isModified('VehicleNo')){
        if(!(/^[A-Z]{2}\d{2}\s[A-Z]{2}\d{4}$/.test(vehicle.VehicleNo))){
            throw Error('Vehicle Number is Invalid')
        }
    }

    next()
})

const Vehicle = mongoose.model('Vehicle', VehicleSchema)

export default Vehicle