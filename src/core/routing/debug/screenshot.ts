import { Request, Response } from "express";
import { ChatGPTApp } from "../../../api/openai";
import { Storage } from "../../../api/common/storage";

// send a request here to take a screen shot
export const screenshotHandler = async (req: Request, res: Response) => {
    if(ChatGPTApp.initialized) {
        const id = await ChatGPTApp.chatgpt.takeScreenshot()
        const blob = Storage.getBlob(id)

        if(blob) {
            const buffer = Buffer.from(await blob.arrayBuffer())
            res.set("Content-Type", "image/jpeg")
            // res.set("Content-Disposition", "attachment; filename=\"image.jpeg\"")
            res.send(buffer)
        } else {
            res.status(500).send("Something went wrong when retriving the image :(")
        }
        
    } else {
        res.status(403).send("App not yet initialized")
    }
}