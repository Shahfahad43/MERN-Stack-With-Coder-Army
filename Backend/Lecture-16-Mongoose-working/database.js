const mongoose = require("mongoose");
async function main() {
  await mongoose.connect(
    "Put your connection link of the cluster./make sure to write the name of here to create a collection.",
  );
}

module.exports = main;
