import { createChat, getChats, getMessages, deleteChat } from "../controller/chat.controller.js";
import express from "express";
import identifier from "../middleware/identifer.middleware.js";

const airouter = express.Router();

airouter.post("/ask-ai", identifier, createChat);

airouter.get("/get-chats", identifier, getChats);

airouter.get("/get-messages/:chatId", identifier, getMessages);

airouter.delete("/delete-chat/:chatId", identifier, deleteChat);

export default airouter;