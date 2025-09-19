export class Storage {
    static #blobs = {} as Record<string, Blob>
    static pageScreen: Blob | undefined = undefined

    static saveBlob(blob: Blob) {
        const id = crypto.randomUUID()
        this.#blobs[id] = blob

        return id
    }

    static getBlob(id: string): Blob | undefined {
        const blob = this.#blobs[id]

        return blob
    }
}