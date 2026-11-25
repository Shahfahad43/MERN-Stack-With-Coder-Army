const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB = process.env.MONGODB_CONNECT_STR;

async function main() {
  await mongoose.connect(MONGODB);
  console.log("MongoDB Connected!");
}

module.exports = main;
