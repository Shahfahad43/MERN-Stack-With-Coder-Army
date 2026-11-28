const express = require("express");
const submitRouter = express.Router();

const userMiddleware = require("../middleware/userMiddleware");

const {
  submitCode,
  runCode,
} = require("../controllers/user-submission-controller");

submitRouter.post("/submit/:id", userMiddleware, submitCode);
submitRouter.post("/run/:id", userMiddleware, runCode);

module.exports = submitRouter;
