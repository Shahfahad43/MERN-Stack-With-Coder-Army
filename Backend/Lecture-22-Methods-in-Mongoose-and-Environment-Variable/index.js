const express = require("express");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const main = require("./database");
const User = require("./Models/user");
const validateuser = require("./Utils/validator");

const app = express();
app.use(express.json());
dotenv.config();
app.use(cookieParser());

// Registering a new user
app.post("/register", async (req, res) => {
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
app.post("/login", async (req, res) => {
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
      { expiresIn: "10s" },
    );

    res.cookie("token", token);

    return res.send("Loging successful!");
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

// getting the loggedin user
app.get("/user", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.send("Login again!");
    const payload = jwt.verify(token, process.env.SECRET_KEY);

    const userId = payload.userId;
    const loggedInUser = await User.findById(userId);
    return res.send(loggedInUser);

    // return res.send(payload);
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

main().then(async () => {
  console.log("App connected to DB");
  app.listen(process.env.PORT, () => {
    console.log(`App is listening at ${process.env.PORT}`);
  });
});

// try{} catch(err){return res.send("Error " + err.message)}
