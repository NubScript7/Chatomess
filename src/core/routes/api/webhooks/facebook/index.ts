import express from "express"
import messageHandler from "./message"
import verifyFBHandler from "./verifyFB"
import fbWebhookMiddleware from "../../../../middleware/facebook/validation/fbWebhook"
import validationCheckMiddleware from "../../../../middleware/facebook/validation/validationCheck"

export const FacebookRouter = express.Router()

FacebookRouter.use(validationCheckMiddleware)

FacebookRouter.get("/message", verifyFBHandler)
FacebookRouter.post("/message",fbWebhookMiddleware, messageHandler)

export default FacebookRouter