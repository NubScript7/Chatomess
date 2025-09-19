import { Application } from "express";
import express from "express"
import { WebhooksRouter } from "./webhooks";
import { DebugRouter } from "./debug";

export const configureRouting = (app: Application) => {
    const router = express.Router();
    app.use('/api', router);
    
    router.use("/webhooks", WebhooksRouter)
    router.use("/debug", DebugRouter)
};