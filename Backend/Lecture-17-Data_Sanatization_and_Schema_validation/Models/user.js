const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    age: {
      type: Number,
      min: 15,
      max: 70,
    },
    gender: {
      type: String,
      //    enum: ["Male", "Female", "Other"],
      validate: () => {
        !["Male", "Female", "Other"];
        throw new Error("Invalid Gender");
      },
    },
    phoneNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }, // to note the time of creation and time of updation.
);

const User = mongoose.model("User", userSchema);

module.exports = User;
