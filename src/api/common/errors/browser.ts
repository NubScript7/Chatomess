export class BrowserError extends Error {
    constructor(message: string) {
        super(message)
    }
}


BrowserError.prototype.name = BrowserError.constructor.name