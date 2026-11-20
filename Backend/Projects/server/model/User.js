import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    iss: { type: String },
    azp: { type: String },
    aud: { type: String },
    sub: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    email_verified: { type: Boolean, default: false },
    nbf: { type: Number },
    name: { type: String, required: true },
    picture: { type: String },
    given_name: { type: String },
    family_name: { type: String },
    iat: { type: Number },
    exp: { type: Number },
    jti: { type: String },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
