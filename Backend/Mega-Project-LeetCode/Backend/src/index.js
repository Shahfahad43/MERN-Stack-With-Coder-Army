const express = require("express");
const app = express();
require("dotenv").config();
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/userAuth.js");

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

const main = require("./config/db");

const PORT = process.env.PORT;

main()
  .then(async () => {
    app.listen(PORT, () => {
      console.log(`App is listening at port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
