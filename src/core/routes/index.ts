import { Application } from "express";
import express from "express"
import { WebhooksRouter } from "./api/webhooks";
import { DebugRouter } from "./api/debug";
import ChecksRouter from "./api/checks";

export const routes = (app: Application) => {
    const router = express.Router();
    app.use('/api', router);
    
    router.use("/webhooks", WebhooksRouter)
    router.use("/debug", DebugRouter)
    router.use("/checks", ChecksRouter)
};

export default routes