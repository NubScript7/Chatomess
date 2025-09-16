import { Router } from "express";
import { Verify_FBHandler } from "./facebook/verify_fbhandler";
import { messageHandler } from "./facebook/message_handler";

export const WebhooksRouter = Router()

WebhooksRouter.get("/message_facebook", Verify_FBHandler)
WebhooksRouter.post("/message_facebook", messageHandler)