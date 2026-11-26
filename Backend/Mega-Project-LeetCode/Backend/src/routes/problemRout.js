const express = require("express");
const problemRoute = express.Router();

// getting all the functions
const { createProblem } = require("../controllers/userProblem-controller");

// admin middleware for creating, updating and deleting the problem
const adminMiddleware = require("../middleware/adminMiddleware");

// For Admin -> That's why we add the admin middleware
// create
problemRoute.post("/create", adminMiddleware, createProblem);

// delete
// problemRoute.delete("/:id", adminMiddleware, deleteProblem);

// // update
// problemRoute.patch("/:id", adminMiddleware, updateProblem);

// // For All
// // fetch
// problemRoute.get("/:id", getProblemById);
// problemRoute.get("/", fetchAllProlbmes);

// // solved problem
// problemRoute.get("/user", solvedProblems);

module.exports = problemRoute;
