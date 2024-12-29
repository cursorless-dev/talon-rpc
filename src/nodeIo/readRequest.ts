import { readFile, stat } from "node:fs/promises";
import { Request } from "../types";

const COMMAND_TIMEOUT_MS = 3000;

/**
 * Reads the JSON-encoded request from the request file, unlinking the file
 * after reading.
 * @returns A promise that resolves to a Response object
 */
export async function readRequest(requestPath: string): Promise<Request> {
    const stats = await stat(requestPath);
    const content = await readFile(requestPath, "utf-8");
    const request = JSON.parse(content) as Request;

    if (Math.abs(stats.mtimeMs - new Date().getTime()) > COMMAND_TIMEOUT_MS) {
        throw new Error("Request file is older than timeout; refusing to execute command");
    }

    return request;
}
