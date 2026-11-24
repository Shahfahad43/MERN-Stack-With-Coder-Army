const express = require("express");
const problemRoute = express.Router();

// For Admin
// create
problemRoute.post("/create", problemCreate);

// delete
problemRoute.delete("/:id", problemDelete);

// update
problemRoute.patch("/:id", problemUpdate);

// For All
// fetch
problemRoute.get("/:id", problemFetch);
problemRoute.get("/", problemFetchAll);

// solved problem
problemRoute.get("/user", problemSolved);
