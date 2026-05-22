import mongoose from "mongoose";


export const DB_CONNECTION = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "perplexity"
        });
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
};