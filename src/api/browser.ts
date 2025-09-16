import _puppeteer, { Browser as PuppeteerBrowser, LaunchOptions, Page } from "puppeteer"
import _StealthPlugin from "puppeteer-extra-plugin-stealth"
import { addExtra } from "puppeteer-extra"
import { chromiumFlags } from "./common/flags";
import { evalBool } from "./common/checks";
import { generateId } from "./common/generate";
import { BrowserError } from "./common/errors/browser";

export const puppeteer = addExtra(_puppeteer);
puppeteer.use(_StealthPlugin())

export class Browser {
    private _pBrowser?: PuppeteerBrowser
    private _pages: Map<string, Page>

    constructor() {
        this._pages = new Map()
    }

    get pages() {
        return this._pages
    }

    get puppeteerBrowser() {
        return this._pBrowser
    }

    async init(launchOptions?: LaunchOptions) {
        const options = launchOptions || {
            args: chromiumFlags,
            devtools: evalBool(process.env.PUPPETEER_BROWSER_DEVTOOLS),
            headless: evalBool(process.env.PUPPETEER_BROWSER_HEADLESS),

        }
        this._pBrowser = await puppeteer.launch(options)
    }
    
    async createPage() {
        if(!this._pBrowser) {
            throw new BrowserError("The browser is not yet initialized.")
        }

        const id = generateId()
        const page = await this._pBrowser?.newPage()
        
        this._pages.set(id, page)
        return page
    }
}