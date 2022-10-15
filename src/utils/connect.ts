import mongoose from "mongoose";
import { DB_URL } from "../config";

const localUrl = "mongodb://localhost:27017/meetvast"
const mongoUrl  = process.env.NODE_ENV === "development" ? localUrl : DB_URL
// const mongoUrl  = process.env.NODE_ENV === "development" ? localUrl : "mongodb+srv://jobmeet:tjhVpLmktkU6pcFV@cluster0.cminvu0.mongodb.net/jobmeet?retryWrites=true&w=majority"

async function connectMongo() : Promise<boolean> {
    try {
        await mongoose.connect(mongoUrl!)
        return true
    } catch (err) {
        console.log("Error connecting to DB. "+err)
        return false
    }
}

export default connectMongo