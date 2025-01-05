import { error } from "console";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI

if(!MONGODB_URI){
    throw new Error("Check your database connection string")

}

const cached = global.mongoose;