import { S_IWOTH } from "node:constants";
import { lstat, mkdir } from "node:fs/promises";
import { userInfo } from "node:os";

export async function initializeCommunicationDir(dirPath: string) {
    console.debug(`Creating communication dir ${dirPath}`);

    await mkdir(dirPath, { recursive: true, mode: 0o770 });

    const stats = await lstat(dirPath);

    const info = userInfo();

    if (
        !stats.isDirectory() ||
        stats.isSymbolicLink() ||
        stats.mode & S_IWOTH ||
        // On Windows, uid < 0, so we don't worry about it for simplicity
        (info.uid >= 0 && stats.uid !== info.uid)
    ) {
        throw new Error(`Refusing to proceed because of invalid communication dir ${dirPath}`);
    }
}
