import dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config({path: './.env'})


export const connectDatabase = async function () {
    try {
        const res = await mongoose.connect(`${process.env.MONGODB_URI}/mentor`)
        console.log(`connected on ${res.connection.host}`)
    } catch (err) {
        console.log(`failed to connect db due to ${err}`)
    }
}


