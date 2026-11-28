const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const authRouter = require("./routes/userAuth.js");
const main = require("./config/db");

// routers
const redisClient = require("./config/redis");
const problemRoute = require("./routes/problemRout.js");
const submitRouter = require("./routes/submit.js");

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/admin", problemRoute);
app.use("/submission", submitRouter);

const PORT = process.env.PORT || 3000;

const initializeConnection = async () => {
  try {
    await main();
    await redisClient.connect();
    console.log("Redis Connected!");
    app.listen(PORT, () => {
      console.log(`App is listening at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Error while connecting:", error.message);
  }
};

initializeConnection();
