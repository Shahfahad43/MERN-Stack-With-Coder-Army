const express = require("express");
const authRouter = express.Router();

// getting the functions from controller
const {
  register,
  login,
  logout,
  getProfile,
  registerAdmin,
  deleteProfile,
  getAllProblemsOfUser,
} = require("../controllers/userAuth-controller");

const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// register
authRouter.post("/register", register);

// admin register
authRouter.post("/admin/register", adminMiddleware, registerAdmin);

// login
authRouter.post("/login", login);

// logout
authRouter.post("/logout", userMiddleware, logout);

// fetching
authRouter.get("/getProfile", getProfile);

// delete profile
authRouter.delete("/deleteProfile", userMiddleware, deleteProfile);

// get the problems of the user
authRouter.get(
  "/getAllProblemsOfUser/:id",
  userMiddleware,
  getAllProblemsOfUser,
);

module.exports = authRouter;
