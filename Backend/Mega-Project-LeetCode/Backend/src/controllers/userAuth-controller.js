const validate = require("../utils/validator");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const redisClient = require("../config/redis");
const Submission = require("../models/problemSubmission");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

// register
const register = async (req, res) => {
  try {
    validate(req.body);

    const { firstName, lastName, emailId, age, password } = req.body;

    // hasing the user password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      age,
      password: hashedPassword,
      role: "user", // this is important because if we don't do this then anyone will be able to send himself as an admin
    });

    // giving token to the user -> header , payload, key
    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      JWT_SECRET,
      {
        expiresIn: 3600,
      },
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 }); // it is in the milliseconds

    res.status(200).json("user created successfuly!", user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

// admin registeration
const registerAdmin = async (req, res) => {
  try {
    validate(req.body);

    const { firstName, lastName, emailId, age, password } = req.body;

    // hasing the user password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      emailId,
      age,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      JWT_SECRET,
      {
        expiresIn: 3600,
      },
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

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

    const token = jwt.sign(
      { _id: user._id, emailId: emailId, role: user.role },
      JWT_SECRET,
      {
        expiresIn: 3600,
      },
    );

    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

    res.status(200).json("Login Successful! ", user);
  } catch (error) {
    return res.status(500).json("Error while login ", error.message);
  }
};

// logut -> we can implement Redis for making it more secure
const logout = async (req, res) => {
  try {
    const { token } = req.cookies;
    const payload = jwt.decode(token);

    await redisClient.set(`token${token}`, `Blocked`);
    await redisClient.expireAt(`token${token}`, payload.exp);

    res.cookie(`token`, null, { expiresIn: new Date(Date.now()) });
    res.send("Logged out successfuly!");
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

// delete user profile
const deleteProfile = async (req, res) => {
  try {
    const user = req.user._id;
    await User.findByIdAndDelete(user);
    await Submission.deleteMany({ user });
    return res.status(200).json("User deleted successfuly!");
  } catch (error) {
    return res
      .status(500)
      .json(`Error while deleting user profile: ${error.message}`);
  }
};

// using this a random jwt secret can be generated.
// node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

// Here make a function in which  You can get all the problems of a specific user in an order and then you can apply the right limiter for cooling down that systems for ten seconds, like you should not be able to use that function just after applying it for ten seconds.

const COOLDOWN_SECONDS = 10;

const getAllProblemsOfUser = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cooldownKey = `cooldown:problems:${userId}`;
    const acquired = await redisClient.set(
      cooldownKey,
      "1",
      "EX",
      COOLDOWN_SECONDS,
      "NX",
    );

    if (!acquired) {
      const ttl = await redisClient.ttl(cooldownKey);
      return res
        .status(429)
        .set("Retry-After", String(ttl))
        .json({
          message: `Please wait ${ttl} more second(s) before retrying`,
          retryAfter: ttl,
        });
    }

    const submissions = await Submission.find({ userId })
      .sort({ createdAt: -1 })
      .populate("problemId", "title difficulty tags")
      .select(
        "problemId status statusId passedTestCases totalTestCases runtime memory createdAt",
      )
      .lean();

    if (!submissions || submissions.length === 0) {
      return res
        .status(404)
        .json({ message: "No submissions found for this user" });
    }

    return res.status(200).json({
      count: submissions.length,
      cooldown: COOLDOWN_SECONDS,
      submissions,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error while getting user's submissions: ${error.message}`,
    });
  }
};

module.exports = {
  register,
  registerAdmin,
  login,
  logout,
  getProfile,
  deleteProfile,
  getAllProblemsOfUser,
};
