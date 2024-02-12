import { log } from "console";
import mongoose from "mongoose";


const connectDb= async()=>{

    try {

        const conn=await mongoose.connect(process.env.MONGO_URI)
        console.log(`connected to data base${conn.connection.host}`);

    } catch (error) {
        console.error(error)
        process.exit(1)
    }

}

export default connectDb
