const express = require("express");
const authRouter = express.Router();

// getting the functions from controller
const {
  register,
  login,
  logout,
  getProfile,
} = require("../controllers/userAuth-controller");

// register
authRouter.post("/register", register);

// login
authRouter.post("/login", login);

// logout
authRouter.post("/logout", logout);

// fetching
authRouter.get("/getProfile", getProfile);

module.exports = authRouter;
