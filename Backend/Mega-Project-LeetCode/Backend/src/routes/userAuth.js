const express = require("express");
const authRouter = express.Router();

// getting the functions from controller
const {
  register,
  login,
  logout,
  getProfile,
  registerAdmin,
} = require("../controllers/userAuth-controller");

// register
authRouter.post("/register", register);

// admin register
authRouter.post("/admin/register", registerAdmin);

// login
authRouter.post("/login", login);

// logout
authRouter.post("/logout", logout);

// fetching
authRouter.get("/getProfile", getProfile);

module.exports = authRouter;
