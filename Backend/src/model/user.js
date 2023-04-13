import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true,
        trim: true
    },
    Email:{
        type: String,
        unique: true,
        required: true,
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
        required:true,
        trim:true,
    },
    Password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
    },
    Gender: {
        type: String,
        required:true,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
},{
    timestamps: true
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.Password
    delete userObject.tokens
    
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
    const user = await User.findOne({Email: email})

    if(!user){
        throw new Error("Wrong Email")
    }

    if(!(password === user.Password)){
        throw new Error('Wrong Password')
    }
    
    return user

}

const User = mongoose.model('User', userSchema)

export default User