import * as os from "node:os";
import * as path from "node:path";

export function getCommunicationDirPath(name: string, tmpDir?: string): string {
    const info = os.userInfo();

    // NB: On Windows, uid < 0, and the tmpdir is user-specific, so we don't
    // bother with a suffix
    const suffix = info.uid >= 0 ? `-${info.uid}` : "";

    // Include TMPDIR to match the implementation of Pythons
    // `tempfile.gettempdir()` that we use client side.
    const tmpDirPath = tmpDir || process.env.TMPDIR || os.tmpdir();

    return path.join(tmpDirPath, `${name}${suffix}`);
}
