import { Request, Response } from "express";
import { ChatGPTApp } from "../../../../api/openai";
import { FBSendApi } from "../../../../api/axios";
import { Storage } from "../../../../common/storage";

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
            return res.sendStatus(403)
        }

        for(const { message, sender } of messaging) {

            if(process.env.DEVLOGS === "true") {
                console.log(`Received message from: ${sender.id}; message: ${message.text}`);
            }

            if(ChatGPTApp.initialized) {
                if(ChatGPTApp.chatgpt.inProgress) {
                    console.log("Waiting for previous request, ignoring this message...");
                    return res.sendStatus(200)
                }

                await FBSendApi.sendMessage(sender.id, "Thinking...⏳")

                const result = await ChatGPTApp.chatgpt.typeQuestion(message.text)   

                FBSendApi.sendMessageDynamic(sender.id, result)
                res.sendStatus(200)
            } else {
                res.sendStatus(403)
            }
        }
    }
}