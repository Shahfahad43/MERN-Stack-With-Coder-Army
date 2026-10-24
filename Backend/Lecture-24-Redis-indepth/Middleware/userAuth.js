const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const redisClient = require("../Config/redis");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token Doesn't exist");
    }
    const payload = jwt.verify(token, process.env.SECRET_KEY);
    const { userId } = payload;

    if (!userId) {
      throw new Error("Id is missing");
    }
    const result = await User.findById(userId);
    if (!result) {
      throw new Error("User Doesn't exist");
    }

    // Checking the user if he is blocked or not
    const isBlocked = await redisClient.exists(`token: ${token}`);
    if (isBlocked) throw new Error("User is blocked!");

    req.result = result;
    next();
  } catch (err) {
    res.send("Error: " + err.message);
  }
};

module.exports = userAuth;
