import mongoose from "mongoose";
import { config } from "./index.js";

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;
