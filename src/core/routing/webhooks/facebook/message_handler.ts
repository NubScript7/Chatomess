import { Request, Response } from "express";
import { ChatGPTApp } from "../../../../api/openai";
import { FBSendApi } from "../../../../api/axios";

export type messageBodyEntryMessagingMessage = {
    mid: string,
    text: string,
}

export type messageBodyEntryMessaging = {
    sender: {
        id: string
    },
    recipient: {
        id: string
    }
    timestamp: number,
    message: messageBodyEntryMessagingMessage
}

export type messageBodyEntry = {
    id: string,
    time: number,
    messaging: messageBodyEntryMessaging[]
}

export type messageBody = {
    object: string,
    entry: messageBodyEntry[]
}

export const messageHandler = async (req: Request, res: Response) => {

    const body : messageBody = req.body
    if(typeof body != "object" || body.object != "page" ) return res.sendStatus(403)

    const { entry } = body

    for(const { messaging } of entry) {
        if(messaging && !Array.isArray(messaging)) {
            res.sendStatus(403)
            return
        }

        for(const { message, sender } of messaging) {

            if(process.env.DEVLOGS === "true") {
                console.log(`Received message from: ${sender.id}; message: ${message.text}`);
            }

            const result = await ChatGPTApp.chatgpt.typeQuestion(message.text)
            console.log("Result got:", result);
            

            FBSendApi.sendMessage(sender.id, result)
            // FBSendApi.sendMessage(sender.id, `Message received. ${new Date().toISOString()}`)
            res.sendStatus(200)
        }
    }
}