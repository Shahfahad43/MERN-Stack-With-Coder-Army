import express from "express";
const app = express();

import route from "./router/router.js";
import bodyParser from "body-parser";

import cors from "cors";
app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

import Connection from "./database/db.js";

app.use("/", route);

Connection();

const PORT = 8000;

app.listen(PORT, () => {
  console.log("App is listening!");
});
