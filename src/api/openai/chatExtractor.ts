import { Page } from "puppeteer";
import { parseSSE, extractData } from "../common/parseText";
import { ChatGPTApp } from ".";

export const initChatExtractor = async (page: Page) => {
    
    //@ts-ignore
    await page.evaluate((a, b) => eval(b), process.env.PAGE_INPUT_TARGET_URL, process.env.PAGE_DATA_LISTED_FUN);

    await page.exposeFunction('analyse', (data: string, id: string) => {
        console.log('Data received.')
        const chunks = parseSSE(data);
        const txt = extractData(chunks);

        ChatGPTApp.event.emit(`message`, txt, id);
    });
}
