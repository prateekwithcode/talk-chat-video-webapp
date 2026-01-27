import mongoose from "mongoose";

export const connectDB=async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`✅Mongodb Connected`);
    } catch (error) {
        console.log("Error in connecting to Mongodb",error);
        process.exit(1)
    }
}