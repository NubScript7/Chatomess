import { setTimeout } from "node:timers/promises";

/**
 * Used to wait for a certain amount of time asyncronously
 * @param ms the time to wait for, in milliseconds
 */
export function waitForAsync(ms: number) {
    return setTimeout(ms)
}

export default waitForAsync