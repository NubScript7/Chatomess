export class BrowserError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name;
    }
}

export class MessengerPageError extends Error {
    constructor(message: string) {
        super(message)
        this.name = this.constructor.name;
    }
}