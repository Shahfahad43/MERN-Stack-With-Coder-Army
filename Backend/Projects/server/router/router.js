import express from "express";
import { addUser, getUser } from "../controller/user-controller.js";
import {
  newConversation,
  getConversation,
} from "../controller/conversation-controller.js";
import { newMessage } from "../controller/message-controller.js";

const rout = express.Router();

rout.post("/add", addUser);
rout.get("/users", getUser);

rout.post("/conversation/add", newConversation);
rout.post("/conversation/get", getConversation);
rout.post("/message/add", newMessage);

export default rout;
