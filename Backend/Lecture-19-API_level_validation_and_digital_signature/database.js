const mongoose = require("mongoose");

async function main() {
  mongoose.connect(
    "mongodb+srv://Shah_Fahad:Fahad123@learningbackend.f4z4wux.mongodb.net/PersonalInfo",
  );
}

module.exports = main;
