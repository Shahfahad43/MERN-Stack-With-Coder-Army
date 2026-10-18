const User = require("../Models/user");
const jwt = require("jsonwebtoken");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Invalid Token!");

    const payload = jwt.verify(token, "Shah@123");

    // Agar token sign karte waqt userId use kiya tha to payload.userId check karo, warna _id
    const userId = payload._id || payload.userId;
    if (!userId) throw new Error("Id is not provided!");

    const user = await User.findById(userId);
    if (!user) throw new Error("User is missing!");

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Error! " + err.message);
  }
};

module.exports = userAuth;
