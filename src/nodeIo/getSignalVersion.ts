import { stat } from "node:fs/promises";

/**
 * Gets the current version of the signal. This version string changes every
 * time the signal is emitted, and can be used to detect whether signal has
 * been emitted between two timepoints.
 * @param filePath The path to the signal file
 * @returns The current signal version or null if the signal file could not be
 * found
 */
export async function getSignalVersion(filePath: string): Promise<string | null> {
    try {
        const stats = await stat(filePath);
        return stats.mtimeMs.toString();
    } catch (err) {
        if ((err as NodeJS.ErrnoException).code !== "ENOENT") {
            throw err;
        }

        return null;
    }
}
