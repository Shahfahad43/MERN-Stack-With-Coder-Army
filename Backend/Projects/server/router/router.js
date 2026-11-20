import express from "express";
import { addUser, getUser } from "../controller/user-controller.js";
import { newConversation } from "../controller/conversation-controller.js";

const rout = express.Router();

rout.post("/add", addUser);
rout.get("/users", getUser);

rout.post("/conversation/add", newConversation);

export default rout;
