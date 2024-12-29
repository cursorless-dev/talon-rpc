import type { FileHandle } from "node:fs/promises";
import { Response } from "../types";

/**
 * Writes the response to the response file as JSON.
 * Appends newline so that other side knows when it is done
 * @param responseFile The file to write to
 * @param response The response object to JSON-encode and write to disk
 */
export async function writeResponse(responseFile: FileHandle, response: Response) {
    const json = `${JSON.stringify(response)}\n`;
    await responseFile.write(json);
}
