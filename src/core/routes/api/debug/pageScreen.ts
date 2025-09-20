import { Request, Response } from "express";
import { Storage } from "../../../../common/utils/storage";
import { ChatGPTApp } from "../../../../api/openai";

export const pageScreenHandler = async (req: Request, res: Response) => {
    if(ChatGPTApp.initialized) {
        const blob = await Storage.pageScreen

        if(blob) {
            const buffer = Buffer.from(await blob.arrayBuffer())
            res.set("Content-Type", "image/jpeg")
            res.send(buffer)
        }
    } else {
        res.status(403).send("App not yet initialized")
    }
}

export default pageScreenHandler