import { checkSchema } from "express-validator";
import FBSendApi from "../../../../api/axios";

type fbWebhookSchemaConfig = {
    senderIdLength: number,
    messageTextLength: number
}

export const fbWebhookConfig: fbWebhookSchemaConfig = {
    senderIdLength: 16,
    messageTextLength: 1
}

export const fbWebhookMiddleware = checkSchema({
    object: {
        equals: {
            errorMessage: "request is not a facebook page update",
            options: "page"
        }
    },
    entry: {
        isArray: {
            errorMessage: "'entry' property is not an array",
            options: {
                min: 1
            }
        }
    },
    'entry.*.messaging': {
        isArray: {
            errorMessage: "'messaging' property is not an array",
            options: {
                min: 1
            }
        }
    },
    'entry.*.messaging.*.sender.id': {
        isString: {
            errorMessage: "sender id must be a string"
        },
        isLength: {
            errorMessage: "sender id must be atleast 16 characters",
            options: {
                min: fbWebhookConfig.senderIdLength
            }
        },
        isValidPsid: {
            custom: async (psid: string) => {

                /**
                 * even though this works (detects if the thing is not valid)
                 * this returns an error to the client BUT lets the request through
                 * - may result in duplicate request
                 * - because facebook re-sends requests when not given 200 OK response
                 */
                const isValid: any = await FBSendApi.getUserFromPsid(psid)
                
                console.log({
                    isValid
                });

                if(!isValid) {
                    return Promise.reject()
                }

                
                return Promise.resolve()
            },
            errorMessage: "sender id is not a valid id"
        }
    },
    'entry.*.messaging.*.message.text': {
        isString: {
            errorMessage: "message text must be a string",
        },
        isLength: {
            errorMessage: "message length must be atleast",
            options: {
                min: fbWebhookConfig.messageTextLength
            }
        },
    }
})

export default fbWebhookMiddleware