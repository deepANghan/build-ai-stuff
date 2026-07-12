import { Router } from "express";
import { GetConversationsController, GetMessageController, PostChatController, PostMessageController } from "../controller/ChatController.js";

export const chatRouter = Router();

chatRouter.post("/create", PostChatController);
chatRouter.get("/", GetConversationsController);

chatRouter.post("/:conversationId", PostMessageController);
chatRouter.get("/:conversationId", GetMessageController);