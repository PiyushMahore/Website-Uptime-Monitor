import mongoose from "mongoose";
import { db_Name } from "../constant.js"

const dbConnect = async() => {
    try {
        const file = await mongoose.connect(`${process.env.DB_URL}/${db_Name}`)
        console.log("database connected sucessfully", file.connection.name);
    } catch (error) {
        console.log("somthing went wrong while connecting database", error);
        process.exit(1)
    }
}

export default dbConnect
