import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
dotenv.config({ path: './.env' })

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: { type: String, required: true },
    password: {
        type: String,
        required: true
    },
    dpLocalPath: {
        type: String,
        required: false
    },
    agreedToTerms: {
        type: Boolean,
        required: true
    },
    refreshToken: {
        type: String
    },
    isInstructor: {
        type: Boolean,
        default: false
    }
},
    {
        timestamps: true
    });

UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    if (this.isModified('trxPassword') && this.trxPassword) {
        this.trxPassword = await bcrypt.hash(this.trxPassword, 10);
    }
    next();
});



UserSchema.methods.isPassCorrect = async function (password) {
    return bcrypt.compare(password, this.password)
}

UserSchema.methods.isTrxPassCorrect = async function (trxPass) {
    return bcrypt.compare(trxPass, this.trxPassword)
}

UserSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
        email: this.email
    }, process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}



export const User = mongoose.model('User', UserSchema)