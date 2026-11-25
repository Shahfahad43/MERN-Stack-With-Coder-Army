const express = require("express");
const problemRoute = express.Router();

// admin middleware for creating, updating and deleting the problem
const adminMiddleware = require("../middleware/adminMiddleware");

// For Admin
// create
problemRoute.post("/create", adminMiddleware, createProblem);

// delete
problemRoute.delete("/:id", adminMiddleware, deleteProblem);

// update
problemRoute.patch("/:id", adminMiddleware, updateProblem);

// For All
// fetch
problemRoute.get("/:id", getProblemById);
problemRoute.get("/", fetchAllProlbmes);

// solved problem
problemRoute.get("/user", solvedProblems);
