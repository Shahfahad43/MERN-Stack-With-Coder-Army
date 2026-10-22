const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../Models/user");
const validateuser = require("../Utils/validator");

const router = express.Router();

// Registering a new user
router.post("/register", async (req, res) => {
  try {
    validateuser(req.body);

    const { firstName, lastName, gender, phoneNumber, email, password } =
      req.body;

    const hashedPass = await bcrypt.hash(password, 5);

    await User.create({
      firstName,
      lastName,
      gender,
      phoneNumber,
      email,
      password: hashedPass,
    });
    return res.send("User registered successfuly");
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

// Login an existing user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.send("Email and Password are required to login");
    const existingUser = await User.findOne({ email });
    if (!existingUser) return res.send("User doesn't exist");

    const isAllowed = await bcrypt.compare(password, existingUser.password);
    if (!email === existingUser.email || !isAllowed)
      return res.send("Invalid credentials!");

    // context -> jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1d' })
    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "100s" },
    );

    res.cookie("token", token);

    return res.send("Loging successful!");
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

// getting the loggedin user
router.get("/user", async function (req, res) {
  try {
    const { token } = req.cookies;
    if (!token) return res.send("Login again!");
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const userId = payload.userId;
    const loggedInUser = await User.findById(userId);
    return res.send(loggedInUser);
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

// getting all the information
router.get("/info", async (req, res) => {
  try {
    const result = await User.find({});
    return res.send(result);
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

// updating an existing user
router.patch("/updateUser", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.send("Login to update the information!");

    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const userId = payload.userId;
    if (!userId) return res.send("User not found!");

    const user = await User.findById(userId);
    if (!user) return res.send("User not found!");

    const allowedUpdate = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "phoneNumber",
    ];

    allowedUpdate.forEach((field) => {
      if (req.body[field] !== undefined) user[field] = req.body[field];
    });

    await user.save();

    return res.send("User updated successfuly!");
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

// delete an existing user
router.delete("/deleteUser", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Login to delete the user!");
    }
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const userId = payload.userId;
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).send("User not found in cluster!");
    }
    res.clearCookie("token");
    return res.status(200).send("User deleted successfully!");
  } catch (err) {
    return res.status(500).send("Error: " + err.message);
  }
});

module.exports = router;
