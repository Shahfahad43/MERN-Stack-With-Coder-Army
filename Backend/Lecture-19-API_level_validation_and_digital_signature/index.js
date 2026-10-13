const express = require("express");
const app = express();
app.use(express.json());

const main = require("./database");
const User = require("./Models/user");
const validateuser = require("./Utils/validateuser");
const bcrypt = require("bcrypt");

app.get("/info", async (req, res) => {
  try {
    const result = await User.find({});
    res.send(result);
  } catch (err) {
    console.log("Error " + err.message);
  }
});

app.get("/info/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send("User not found!");
    res.send(user);
  } catch (err) {
    res.status(404).send("Error! " + err.message);
  }
});

// simple login
app.get("/login", async (req, res) => {
  try {
    const user = await User.findById(req.body._id);
    if (!user) res.send("User not found");
    // res.send(user);

    const loginEmail = req.body.email;
    const loginPass = req.body.password;

    if (loginEmail !== user.email) res.send("Invalid credentials");
    if (loginPass !== user.password) res.send("Invalid credentials");
    res.send("Login successful!");
  } catch (err) {
    res.send(err.message);
  }
});

// Secure login
app.post("/SecureLogin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    res.send("Login successful!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

app.post("/register", async (req, res) => {
  try {
    validateuser(req.body);

    const { firstName, lastName, age, gender, phoneNumber, email, password } =
      req.body;

    // Using bcrypt you can store the password securely.
    const hashedPass = await bcrypt.hash(req.body.password, 10);

    await User.create({
      firstName,
      lastName,
      age,
      gender,
      phoneNumber,
      email,
      password: hashedPass,
    });

    res.send("User registered successfully!");
  } catch (err) {
    console.log("Error " + err.message);
    res.status(400).send(err.message);
  }
});

main().then(async () => {
  console.log("Connected to DB Successfuly!");
  app.listen(3000, () => {
    console.log("App is listening at 3000");
  });
});

// try{} catch(err){console.log("Error " + err.message)}
