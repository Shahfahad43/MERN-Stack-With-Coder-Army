const express = require("express");
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");

const main = require("./database");
const auth = require("./Authentication/auth");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cookieParser());

app.use("/", auth);

main().then(async () => {
  console.log("App connected to DB");
  app.listen(process.env.PORT, () => {
    console.log(`App is listening at ${process.env.PORT}`);
  });
});

// try{} catch(err){return res.send("Error " + err.message)}
