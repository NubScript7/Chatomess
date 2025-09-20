import { ChatGPTApp } from "./api/openai"
import express from "express"
import { routes } from "./core/routes"
import { logger } from "./common/utils/logger"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(process.env.PORT || 3000, async () => {
    logger.info(`Server is running on port ${process.env.PORT || 3000}`)
    
    await ChatGPTApp.init()
    routes(app)
    logger.info("Routes are now open!")
})
