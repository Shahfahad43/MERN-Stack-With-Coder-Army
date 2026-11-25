const jwt = require("jsonwebtoken");
require("dotenv").config();

const userMiddleware = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) throw new Error("Please login first!");

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = payload;

    if (!id) throw new Error("User doesn't exist");

    // here we will use the Redis
  } catch (error) {
    return res.status(500).json("Error in user middleware", error.message);
  }
};
