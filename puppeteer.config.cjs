const { join } = require("node:path");
const dotenv = require("dotenv")
const os = require("node:os")
dotenv.config()
/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
    cacheDirectory: process.env.PLATFORM_HOSTED == "true" ? 
        join(__dirname, ".cache", "puppeteer") : 
        join(os.homedir(), '.cache', 'puppeteer')
};
