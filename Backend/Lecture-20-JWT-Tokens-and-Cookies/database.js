const mongoose = require("mongoose");
async function main() {
  await mongoose.connect("put you connection string here.");
}

module.exports = main;
