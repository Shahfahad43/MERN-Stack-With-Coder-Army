const validate = require("../utils/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// register
const register = async (req, res) => {
  try {
    validate(req.body);

    const { firstName, emailId, password } = req.body;

    // hasing the user password
    req.body.password = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);

    // giving token to the user -> header , payload, key
    const token = jwt.sign({ _id: user._id, emailId: emailId }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 }); // it is in the milliseconds

    res.status(200).json("user created successfuly!", user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// login
const login = async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) throw new Error("Invalid credentials!");

    const user = await User.findOne({ emailId });
    if (!user) throw new Error("Invalid credentials!");

    const userPass = user.password;

    const match = await bcrypt.compare(password, userPass);

    if (!match) throw new Error("Invalid credentials!");

    const token = jwt.sign({ _id: user._id, emailId: emailId }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(200).json("Login Successful! ", user);
  } catch (error) {
    return res.status(500).json("Error while login ", error.message);
  }
};

// logut -> we can implement Redis for making it more secure
const logout = async (req, res) => {
  try {
  } catch (error) {
    return res.status(500).json("Error while login ", error.message);
  }
};

// fetch
const getProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(404).json("Login first!");

    const decoded = jwt.verify(token, JWT_SECRET);

    const founded = await User.findById(decoded._id);
    if (!founded) return res.status(404).json("User not found!");
    return res.status(200).json(founded);
  } catch (error) {
    return res
      .status(500)
      .json("Error while getting user information, ", error.message);
  }
};

// using this a random jwt secret can be generated.
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

module.exports = { register, login, logout, getProfile };
