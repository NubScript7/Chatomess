import { Router } from "express";
import ChecksRouter from "../checks";
import FacebookRouter from "./facebook";

export const WebhooksRouter = Router()

WebhooksRouter.use("/facebook", FacebookRouter)

export default ChecksRouter