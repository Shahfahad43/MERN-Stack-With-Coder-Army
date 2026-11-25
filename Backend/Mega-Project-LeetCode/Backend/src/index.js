require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const authRouter = require("./routes/userAuth.js");
const main = require("./config/db");
const redisClient = require("./config/redis");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3000;

const initializeConnection = async () => {
  try {
    await main();
    await redisClient.connect();
    console.log("DBs Connected!");
    app.listen(PORT, () => {
      console.log(`App is listening at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error while connecting:", error.message);
  }
};

initializeConnection();
