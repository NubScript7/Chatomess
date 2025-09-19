import { Request, Response } from "express";
import { ChatGPTApp } from "../../../api/openai";
import { Storage } from "../../../common/storage";

// send a request here to take a screen shot
export const screenshotHandler = async (req: Request, res: Response) => {
    if(ChatGPTApp.initialized) {
        const image = await ChatGPTApp.chatgpt.takeScreenshot()
        res.set("Content-Type", "image/png")
        res.send(Buffer.from(image))
        // res.send(image)
    } else {
        res.status(403).send("App not yet initialized")
    }
}