import mongoose from "mongoose";

const connectDB=async(uri:string):Promise<void> =>{

    try {
        
        await mongoose.connect(uri)
          console.log("✅ MongoDB Connected");
    } catch (err:any) {
        
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1)
    }
}

export default connectDB