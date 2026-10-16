const express = require("express");
const app = express();

const main = require("./database");
const User = require("./Models/user");
const validateuser = require("./Utils/validator");
const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");
app.use(cookieParser());
// using this we can pare the cookies and hence can see them.
const jwt = require("jsonwebtoken");

app.use(express.json());

// Getting the user information
app.get("/info", async (req, res) => {
  // First we have to verify the user

  // console.log(payload);
  // If verified, then it will give you result like this { email: 'zainab.khan@proton.me', iat: 1792126009 }

  // We can get the existing cookies from here. The browser does it for us. But it will show undefined because we didn't install mandatory things and we have parse it.
  // console.log(req.cookies);

  const payload = jwt.verify(req.cookies.token, "Shah@123");
  console.log(payload);

  const result = await User.find({});
  res.send(result);
});

app.get("/user", async (req, res) => {
  try {
    // const user = await User.findById(req.params.id);
    const payload = jwt.verify(req.cookies.token, "Shah@123");
    const user = await User.findById(payload.userId);
    console.log(user);
    return res.send(user);
  } catch (err) {
    return res.send("Error " + err.message);
  }
});

// app.get("/user", async (req, res) => {
//   try {
//     // const user = await User.findById(req.params.id);
//     // but we have to keep this id safe and secure that's why we use here jwt

//     const payload = jwt.verify(req.cookies.token, "Shah@123");
//     const user = await User.findById(payload._id);
//     if (!user) return res.send("User not found!");
//     return res.send(user);
//   } catch (err) {
//     return res.send("Error " + err.message);
//   }
// });

// Registering a new user.
app.post("/register", async (req, res) => {
  try {
    validateuser(req.body);

    const { firstName, lastName, age, phoneNumber, gender, email, password } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered!" });
    }

    const securePass = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      age,
      phoneNumber,
      gender,
      email,
      password: securePass,
    });

    return res.status(201).send("User registered successfully!");
  } catch (error) {
    return res.status(400).send("Validation Error: " + error.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required!" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isAllowed = await bcrypt.compare(password, user.password);
    if (!isAllowed) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // From here we can send the cookie in the form of cookie.
    // res.cookie("token", "thisistheexmapletoken23rndsl9394hds");

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      "Shah@123",
      {
        expiresIn: 10,
        // valid for 10s -> After the completion of 10s, it will get expired.
      },
    );
    // Here is payload. and the header part is included by itself.

    res.cookie("token", token);

    return res.status(200).json({
      message: "Login successful!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
});

main().then(() => {
  console.log("Connected to Database!");
  app.listen(3000, () => {
    console.log("App is listening at 3000");
  });
});
