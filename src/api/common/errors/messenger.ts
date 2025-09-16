export class MessengerPageError extends Error {
    constructor(message: string) {
        super(message)
    }
}


MessengerPageError.prototype.name = MessengerPageError.constructor.name