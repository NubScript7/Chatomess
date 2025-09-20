import axios, { AxiosError } from "axios"
import chunkify from "../../common/utils/chunkify";
import logger, { smartLogger } from "../../common/utils/logger";


const CONSTANTS = {
    FB_GRAPH_API_URL : "https://graph.facebook.com/v23.0"
}

export class FBSendApi {
    static axiosInstance = axios.create({
        baseURL: CONSTANTS.FB_GRAPH_API_URL,
        params: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN
        }
    })

    static async getUserFromPsid(recipientId: string) {
        try {
            const response = await this.axiosInstance.get(
                `/${recipientId}`,
                {
                    params: {
                        fields: "id",
                    }
                }
            )

            if(response.data?.id == recipientId) {
                return true
            } else {
                return false
            }
        } catch(error) {
            return false;
        }
    }

    static async sendMessage(recipientId: string, message: string) {
        try {
            await this.axiosInstance.post("/me/messages",
                {
                    recipient: {
                        id: recipientId
                    },
                    message: {
                        text: message
                    }
                })
        } catch(error) {
            smartLogger(error);
        }
    }

    static async sendMsgsConsecutively(recipientId: string, messages: string[]) {
        for(const message of messages) {
            try {
                await this.sendMessage(recipientId, message)
            } catch (err: any) {
                smartLogger(err)
                
                this.sendMessage(recipientId, "Failed to send this message 😢")
                .catch((err) => {
                    smartLogger(err);
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

export default FBSendApi