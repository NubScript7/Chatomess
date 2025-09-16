import { Application } from "express";
import express from "express"
import { WebhooksRouter } from "./webhooks";

export const configureRouting = (app: Application) => {
    const router = express.Router();
    app.use('/api', router);
    
    router.use("/webhooks", WebhooksRouter)
};