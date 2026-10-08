const mongoose = require("mongoose");
async function main() {
  await mongoose.connect(
    "mongodb+srv://Shah_Fahad:Fahad123@learningbackend.f4z4wux.mongodb.net/Bookstore",
  );
}

module.exports = main;
