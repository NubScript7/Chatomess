import { Page } from "puppeteer";
import { Browser } from "../browser";
import { MessengerPageError } from "../../common/errors";
import { waitForAsync } from "../../common/timer";
import UserAgent from "user-agents";
import { createCursor } from "ghost-cursor"

const userAgents = new UserAgent({
    platform: 'Win32',
})

export class MessengerPageManager {
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
        const mPage = new MessengerPage(pPage)
        return mPage
    }

    get puppeteerBrowser() {
        return this._browser.puppeteerBrowser
    }
}

// the credentials used to login
export type MessengerPageLoginCred = {
    // the email/phone number used to login to the account
    emailOrPhone: string,
    // the password  used to login to the account
    password: string
}

// the options used when trying to login
export type MessengerPageLoginoptions = {
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

export class MessengerPage {
    page: Page
    constructor(p: Page) {
        this.page = p
    }

    get isUrlMessenger() {
        return this.page.url().search("messeger.com") != -1
    }

    async login(cred: MessengerPageLoginCred, options?: MessengerPageLoginoptions) {
        const cursor = createCursor(this.page)
        const emailPhone = cred.emailOrPhone
        const password = cred.password
        
        const waitTime = options?.timeoutPerAction || 3000

        
        if(!this.isUrlMessenger) {
            await this.page.goto("https://messenger.com", {
                waitUntil: "networkidle2"
            })
        }
        
        const emailEl = await this.page.$("[id=email]")
        const passEl = await this.page.$("[id=pass]")
        const loginEl = await this.page.$("[id=loginbutton]")
        console.log({
            loginEl
        })
        
        if(!emailEl || !passEl || !loginEl) {
            throw new MessengerPageError("Email, password or login element cannot be found.")
        }


        
        await cursor.move(emailEl, {
            inViewportMargin: numberRng(20, 50),
            scrollDelay: numberRng(20, 200),
            scrollSpeed: numberRng(35, 75)
        })
        await emailEl.type(emailPhone, {
            delay: numberRng(80, 250)
        })
        console.log("typed email/phone")
        await wait(waitTime)
        
        
        await cursor.move(passEl, {
            inViewportMargin: numberRng(20, 50),
            scrollDelay: numberRng(20, 200),
            scrollSpeed: numberRng(35, 75)
        })
        await passEl.type(password, {
            delay: numberRng(80, 250)
        })
        console.log("typed password")
        await wait(waitTime)
        
        await loginEl.scrollIntoView()
        await wait(1000)
        loginEl.click({
            delay: numberRng(100, 250)
        })

        // await cursor.scrollIntoView(loginEl, {
        //     scrollSpeed: numberRng(35, 75)
        // })
        // await cursor.click(loginEl, {
        //     hesitate: numberRng(1000, 3000)  
        // })
        
        console.log("clicked login")


        return this
    }
}