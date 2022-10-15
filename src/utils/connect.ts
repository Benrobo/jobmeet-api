import mongoose from "mongoose";
import { DB_URL } from "../config";

const localUrl = "mongodb://localhost:27017/meetvast"
const mongoUrl  = process.env.NODE_ENV === "development" ? localUrl : DB_URL

async function connectMongo() : Promise<void> {
    try {
        await mongoose.connect(mongoUrl!)
    } catch (err) {
        console.log("Error connecting to DB. "+err)
    }
}

export default connectMongo