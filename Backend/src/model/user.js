import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: [true,'Name is Required'],
        trim: true
    },
    Email:{
        type: String,
        unique: true,
        required: [true,'Email is required'],
        trim: true,
        lowercase: true,    
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    MobileNo:{
        type: Number,
        unique:true,
        required:[true,"Mobile No. is Required"],
        trim:true,
        min:1000000000,
        max:9999999999
    },
    Password: {
        type: String,
        required: [true, "Password is Required"],
        minlength: 6,
        trim: true,
      
    },
    Gender: {
        type: String,
        enum:{
            values:["Male", "Female", "Other"],
            message: "{VALUE} is not supported"
        }
    },
    DOB:{
        type: String,
    },
    LicenceNo:{
        type:String,
        minlength:15,
        maxlength:15,
    },
    status:{
        type:String,
        default:'pending',
        enum:{
            values:["verified", "pending"],
            message: "{VALUE} is not supported"
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    isDeleted:{
        type: Boolean,
        default: false,
    }
},{
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.Password
    delete userObject.tokens
    delete userObject.isDeleted
    delete userObject.__v

    return userObject
}

//generate authentication token
userSchema.methods.generateToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, "hrkyada");

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token
}


//match user
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({Email: email, isDeleted: false})

    if(!user){
        throw new Error("Wrong Email")
    }

    const isMatch = await bcrypt.compare(password, user.Password)

    if(!isMatch){
        throw new Error('Wrong Password')
    }
    
    return user

}

userSchema.pre('save', async function (next) {
    const user = this
    
    if (user.isModified('Password')) {
        if(!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(user.Password))){
            throw Error( "Password must contain minimum One UpperCase Character, One LowerCase Character, One special character and One number.!")
        }
        user.Password = await bcrypt.hash(user.Password, 8)
    }

    if(user.isModified('LicenceNo')){
        if(!(/^[A-Z]{2}\d{2}(19|20)\d{9}$/.test(user.LicenceNo))){
            throw Error('Driving Licence Number is Invalid')
        }
    }

    next()
})

const User = mongoose.model('User', userSchema)

export default User