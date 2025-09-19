import axios from "axios"
import chunkify from "../../common/chunkify";

const CONSTANTS = {
    FB_GRAPH_API_URL : "https://graph.facebook.com/v23.0/me"
}

export class FBSendApi {
    static axiosPostInstance = axios.create({
        baseURL: CONSTANTS.FB_GRAPH_API_URL,
        method: "POST",
        params: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN
        }
    })

    static async sendMessage(recipientId: string, message: string) {
        try {
            await this.axiosPostInstance.post("/messages",
                {
                    recipient: {
                        id: recipientId
                    },
                    message: {
                        text: message
                    }
                })
        } catch(error) {
            console.log(error);
        }
    }

    static async sendMsgsConsecutively(recipientId: string, messages: string[]) {
        for(const message of messages) {
            try {
                await this.sendMessage(recipientId, message)
            } catch (e: any) {
                
                this.sendMessage(recipientId, "Failed to send this message 😢")
                .catch((e) => {
                    console.log(e);
                })
            }
        }
    }

    static async sendMessageDynamic(recipientId: string, message: string) {
        if(typeof message !== "string") {
            throw new TypeError("Message must be a string")
        }

        if(message.length > 2000) {
            const chunks = chunkify(message)
            await this.sendMsgsConsecutively(recipientId, chunks)
        } else {
            await this.sendMessage(recipientId, message)
        }
    }
}

