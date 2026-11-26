const express = require("express");
const problemRoute = express.Router();

// getting all the functions
const {
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemById,
  fetchAllProlbmes,
} = require("../controllers/userProblem-controller");

// admin middleware for creating, updating and deleting the problem
const adminMiddleware = require("../middleware/adminMiddleware");

// user middleware
const userMiddleware = require("../middleware/userMiddleware");

// For Admin -> That's why we add the admin middleware
// create
problemRoute.post("/create", adminMiddleware, createProblem);

// delete
problemRoute.delete("/delete/:id", adminMiddleware, deleteProblem);

// update
problemRoute.patch("/update/:id", adminMiddleware, updateProblem);

// For All
// fetch
problemRoute.get("/problemById/:id", userMiddleware, getProblemById);
problemRoute.get("/allProblem", userMiddleware, fetchAllProlbmes);

// solved problem
problemRoute.get("/user", solvedProblems);

module.exports = problemRoute;
