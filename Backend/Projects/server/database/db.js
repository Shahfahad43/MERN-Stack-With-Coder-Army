import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const Connection = async () => {
  const URL = process.env.MONGODB_CONNECT;

  try {
    await mongoose.connect(URL);
    console.log("Database connected successfuly!");
  } catch (error) {
    console.log("Error :" + error.message);
  }
};

export default Connection;
