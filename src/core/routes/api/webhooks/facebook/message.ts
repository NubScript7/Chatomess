import { Request, Response } from "express";
import { ChatGPTApp } from "../../../../../api/openai";
import { FBSendApi } from "../../../../../api/axios";
import { Storage } from "../../../../../common/utils/storage";
import logger from "../../../../../common/utils/logger";

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
    const { entry } = body

    for(const { messaging } of entry) {

        for(const { message, sender } of messaging) {

            if(process.env.DEVLOGS === "true") {
                logger.info(`Received message from: ${sender.id}; message: ${message.text}`);
            }

            if(ChatGPTApp.initialized) {
                if(ChatGPTApp.chatgpt.inProgress) {
                    res.status(403).send("Waiting for another request to complete...")
                    return logger.info("Waiting for previous request, ignoring this message...");7
                }

                res.sendStatus(200);

                await FBSendApi.sendMessage(sender.id, "Thinking...⏳")

                const result = await ChatGPTApp.chatgpt.typeQuestion(message.text)   

                FBSendApi.sendMessageDynamic(sender.id, result)
            } else {
                res.status(403).send("Waiting for app to initialize...")
            }
        }
    }
}

export default messageHandler