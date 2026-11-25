const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB = process.env.MONGODB_CONNECT_STR;

async function main() {
  await mongoose.connect(MONGODB);
  console.log("Connected to Database!");
}

module.exports = main;
