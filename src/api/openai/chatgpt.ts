import { Page } from "puppeteer"
import { Browser } from "../browser"
import { Browser as PuppeteerBrowser } from "puppeteer"
import UserAgent from "user-agents"
import { waitForAsync } from "../common/timer"
import { Cookie } from "puppeteer"
import { configDotenv } from "dotenv"
import { ChatGPTApp } from "."

configDotenv()

const CONSTANTS = {
    CHATGPT_URL: process.env.CHATGPT_CONVERSATION_ID ? `https://chatgpt.com/c/${process.env.CHATGPT_CONVERSATION_ID}` : "https://chatgpt.com",
    TEXTAREA_SELECTOR: "#prompt-textarea"
}

const userAgents = new UserAgent({
    platform: 'Win32',
})

export class ChatgptPageManager {
    private _browser: Browser

    constructor() {
        this._browser = new Browser()
    }

    async init() {
        await this._browser.init()
        return this
    }

    async newPage() {
        const pPage = await this._browser.createPage()

        const randomAgents = userAgents.random()
        await pPage.setUserAgent(randomAgents.toString())
        const cPage = new ChatGPTPage(pPage)
        return cPage
    }

    get puppeteerBrowser() {
        return this._browser.puppeteerBrowser
    }
}


// the credentials used to login
export type ChatgptPageLoginCred = {
    // the email/phone number used to login to the account
    emailOrPhone: string,
    // the password  used to login to the account
    password: string
}

// the options used when trying to login
export type ChatgptPageLoginoptions = {
    // the amount of time to wait before proceeding to each action. Time in milliseconds (default: 2000)
    timeoutPerAction: number

    // should we wait some times for each action. Recommended to be `true` to avoid bot detection. (default: true)
    // enableTimeoutPerAction: boolean
}

function wait(n: number = 3000) {
    return waitForAsync(n)
}

function numberRng(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

export class ChatGPTPage {
    page: Page
    browser: PuppeteerBrowser
    constructor(p: Page) {
        this.page = p
        this.page.setDefaultNavigationTimeout(5 * 60 * 1000)
        this.browser = p.browser()
    }

    get isUrlMessenger() {
        return this.page.url().search("messeger.com") != -1
    }

    async loginWithCookies(cookies: Cookie[]) {
        this.browser.setCookie(...cookies)
    }

    async initSession() {
        await this.page.goto(CONSTANTS.CHATGPT_URL, {
            waitUntil: "networkidle2"
        })
    }

    async typeQuestion(question: string) {
        const textarea = await this.page.waitForSelector(CONSTANTS.TEXTAREA_SELECTOR)
        if(!textarea) {
            throw new Error("could not find the textarea element")
        }

        const requestID = crypto.randomUUID()

        //@ts-ignore
        await this.page.evaluate(id => window.__currentAskId = id, requestID)

        await textarea.type(question, { delay: numberRng(100, 150) })
        await wait(1000)
        await textarea.press("Enter")

        return new Promise<string>((resolve) => {
            ChatGPTApp.event.once("message", resolve)
        })
    }

    /**
     * this method is complicated because we need a capcha solver (which is not free right now)
     */

    // async login(cred: ChatgptPageLoginCred, options?: ChatgptPageLoginoptions) {

    //     const emailPhone = cred.emailOrPhone
    //     const password = cred.password
        
    //     const waitTime = options?.timeoutPerAction || 3000

        
    //     if(!this.isUrlMessenger) {
    //         await this.page.goto("https://auth.openai.com/log-in", {
    //             waitUntil: "networkidle2"
    //         })
    //     }
        
    //     const emailEl = await this.page.$("[autocomplete=email]")


    //     return this
    // }
}