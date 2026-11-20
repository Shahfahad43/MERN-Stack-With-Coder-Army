import express from "express";
import { addUser, getUser } from "../controller/user-controller.js";
import {
  newConversation,
  getConversation,
} from "../controller/conversation-controller.js";

const rout = express.Router();

rout.post("/add", addUser);
rout.get("/users", getUser);

rout.post("/conversation/add", newConversation);
rout.post("/conversation/get", getConversation);

export default rout;
