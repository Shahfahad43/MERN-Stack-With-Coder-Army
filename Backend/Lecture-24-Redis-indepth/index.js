const express = require("express");
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");

const main = require("./database");
const redisClient = require("./Config/redis");
const auth = require("./Authentication/auth");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cookieParser());

app.use("/", auth);

// Optimized way of initializing the server.
const IinitializeConnection = async () => {
  try {
    // await redisClient.connect();
    // console.log("Connected to Redis!");

    // await main();
    // console.log("Connected to MongoDB!");

    // or the more alternative way
    await Promise.all([redisClient.connect(), main()]);
    console.log("Connected!");

    app.listen(process.env.PORT, () => {
      console.log(`App is listening at ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Error " + err);
  }
};

IinitializeConnection();

// main().then(async () => {
//   console.log("App connected to DB");
//   app.listen(process.env.PORT, () => {
//     console.log(`App is listening at ${process.env.PORT}`);
//   });
// });

// try{} catch(err){return res.send("Error " + err.message)}
