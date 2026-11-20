import express from "express";
import { addUser, getUser } from "../controller/user-controller.js";

const rout = express.Router();

rout.post("/add", addUser);
rout.get("/users", getUser);

export default rout;
