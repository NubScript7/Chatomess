import axios from "axios"

const CONSTANTS = {
    FB_GRAPH_API_URL : "https://graph.facebook.com/v17.0/me"
}

export class FBSendApi {
    static axiosPostInstance = axios.create({
        baseURL: CONSTANTS.FB_GRAPH_API_URL,
        method: "POST",
        params: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN
        }
    })

    static async sendMessage(recepientId: string, message: string) {
        try {
            await this.axiosPostInstance.post("/messages", null, {
                params: {
                    recipient: {
                        id: recepientId
                    },
                    message: {
                        text: message
                    }
                }
            })
        } catch(error) {
            console.log(error);
        }
    }
}

