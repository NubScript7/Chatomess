import { config } from "dotenv";
import { ChatGPTPage, ChatgptPageManager } from "./chatgpt";
import { readFile, writeFile } from "node:fs/promises";
import { log } from "node:console";
import EventEmitter from "node:events";
import { initChatExtractor } from "./chatExtractor";
config()

const CONSTANTS = {
    MESSENGER_EMAILORPHONE: process.env.MESSENGER_EMAILORPHONE,
    MESSENGER_PASSWORD: process.env.MESSENGER_PASSWORD,

    CHATGPT_EMAILORPHONE: process.env.CHATGPT_EMAILORPHONE,
    CHATGPT_PASSWORD: process.env.CHATGPT_PASSWORD,

    CHATGPT_COOKIES_FILE: process.env.CHATGPT_COOKIES_FILE || "./cookie/chatgpt.json", 
}



if(!CONSTANTS.MESSENGER_EMAILORPHONE || !CONSTANTS.MESSENGER_PASSWORD || !CONSTANTS.CHATGPT_EMAILORPHONE || !CONSTANTS.CHATGPT_PASSWORD) {
    throw new Error("the required email/phone or password environment string is undefined.")
}

export class ChatGPTApp {
    static chatgpt: ChatGPTPage
    static event: EventEmitter = new EventEmitter()
    static async init() {
    
        const cookieTxt = await readFile(CONSTANTS.CHATGPT_COOKIES_FILE, { encoding: "utf-8" })
        const chatgptCookies = JSON.parse(cookieTxt)

        const chatgptManager = new ChatgptPageManager()
        await chatgptManager.init()

        
        const page = await chatgptManager.newPage()
        
        page.browser.on("disconnected", async () => {
            console.log("saving cookies...");
            
            const cookies = page.browser.cookies()
            await writeFile(CONSTANTS.CHATGPT_COOKIES_FILE, JSON.stringify(cookies))
            
            console.log("cookies saved :D");

            process.exit(0)
        })


        await page.loginWithCookies(chatgptCookies)
        log("logged in")

        await page.initSession()
        log("opened chatgpt page")

        await initChatExtractor(page.page)

        ChatGPTApp.chatgpt = page
    }
}