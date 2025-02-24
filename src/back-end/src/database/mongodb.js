import mongoose from "mongoose";
import { MONGODB_URI, NODE_ENV } from "../config/env.js";

if (!MONGODB_URI) {
  throw new Error("Please specifiy a MONGODB_URI varibale in .env.development");
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected to Database in ${NODE_ENV} mode`);
  } catch (err) {
    console.log("Error connecting to Database: ", err);
    process.exit(1);
  }
};

export default connectToDatabase;
