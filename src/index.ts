import { ChatGPTApp } from "./api/openai"
import express from "express"
import { configureRouting } from "./core/routing"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

configureRouting(app)

const init = async () => {
    await ChatGPTApp.init()

    ChatGPTApp.event.on("message", (msg: string) => {
        console.log("New message from ChatGPT: ", msg);
        
    })
}

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
    init()
})
