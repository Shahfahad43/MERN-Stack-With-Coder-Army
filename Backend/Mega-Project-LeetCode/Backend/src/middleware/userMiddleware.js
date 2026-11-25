const jwt = require("jsonwebtoken");
const redisClient = require("../config/redis");

const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "Please login first!" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = payload;

    if (!_id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const isBlacklisted = await redisClient.exists(`blacklist:${token}`);
    if (isBlacklisted) {
      return res
        .status(401)
        .json({ message: "Token has been invalidated (logged out)" });
    }

    req.user = payload;
    return next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ message: error.message });
  }
};

module.exports = userMiddleware;
