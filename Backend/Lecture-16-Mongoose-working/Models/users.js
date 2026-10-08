const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema({
  name: String,
  city: String,
  age: Number,
  gender: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
