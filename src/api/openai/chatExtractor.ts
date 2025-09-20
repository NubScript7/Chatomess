import { Page } from "puppeteer";
import { parseSSE, extractData } from "../../common/utils/parseText";
import { ChatGPTApp } from ".";
import logger from "../../common/utils/logger";

export const initChatExtractor = async (page: Page) => {
    
    //@ts-ignore
    await page.evaluate((a, b) => eval(b), process.env.PAGE_INPUT_TARGET_URL, process.env.PAGE_DATA_LISTED_FUN);

    await page.exposeFunction('analyse', (data: string, id: string) => {
        logger.info('Data received.')
        const chunks = parseSSE(data);
        const txt = extractData(chunks) || "No response detected.";

        ChatGPTApp.event.emit(`message`, txt, id);
    });
}

export default initChatExtractor