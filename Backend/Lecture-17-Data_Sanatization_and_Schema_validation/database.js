const mongoose = require("mongoose");

async function main() {
  await mongoose.connect(
    "Put your database cluster link here and make sure to write the name of the collection after / i.e. databasecluster/nameofthecollection",
  );
}

module.exports = main;
