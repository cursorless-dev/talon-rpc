import { FileHandle, open } from "node:fs/promises";
import { join } from "node:path";
import type { Io, Request, Response } from "../types";
import { getCommunicationDirPath } from "./getCommunicationDirPath";
import { getSignalVersion } from "./getSignalVersion";
import { initializeCommunicationDir } from "./initializeCommunicationDir";
import { readRequest } from "./readRequest";
import { writeResponse } from "./writeResponse";

export class NodeIo implements Io {
    public readonly dirPath: string;
    private readonly signalsDir: string;
    private readonly requestPath: string;
    private readonly responsePath: string;
    private responseFile: FileHandle | null;

    constructor(dirName: string, tmpDir?: string) {
        this.dirPath = getCommunicationDirPath(dirName, tmpDir);
        this.signalsDir = join(this.dirPath, "signals");
        this.requestPath = join(this.dirPath, "request.json");
        this.responsePath = join(this.dirPath, "response.json");
        this.responseFile = null;
    }

    async initialize(): Promise<void> {
        await initializeCommunicationDir(this.dirPath);
    }

    async prepareResponse(): Promise<void> {
        if (this.responseFile != null) {
            throw new Error("Response is already locked");
        }
        this.responseFile = await open(this.responsePath, "wx");
    }

    async closeResponse(): Promise<void> {
        if (this.responseFile == null) {
            throw new Error("Response is not locked");
        }
        await this.responseFile.close();
        this.responseFile = null;
    }

    readRequest(): Promise<Request> {
        return readRequest(this.requestPath);
    }

    writeResponse(response: Response) {
        if (this.responseFile == null) {
            throw new Error("Response is not locked");
        }
        return writeResponse(this.responseFile, response);
    }

    getInboundSignal(name: string) {
        const signalPath = join(this.signalsDir, name);
        return {
            getVersion: () => getSignalVersion(signalPath),
        };
    }
}
