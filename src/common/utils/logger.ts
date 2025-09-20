import pino from "pino"
import dayjs from "dayjs"
import { AxiosError } from "axios"



export const logger = pino({
    transport: {
        target: "pino-pretty",
        options: {
            colorize: true,
            levelFirst: true,
            translateTime: "SYS:yyyy-mm-dd HH:MM:ss.l",
        },
        
    },
    name: "Chatomess",
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
})

export const smartLogger = (error: unknown) => {
    if(error instanceof AxiosError) {
        logger.error({
            msg: error.message,
            code: error.code,
            isAxiosError: error.isAxiosError
        })
    } else {
        logger.error(error)
    }
}

export default logger