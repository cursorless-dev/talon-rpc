import type { Io, Request, RequestCallback, RequestCallbackOptions } from "./types";

export class TalonRpcServer {
    constructor(private io: Io) {}

    async executeRequest(requestCallback: RequestCallback): Promise<void> {
        await this.io.prepareResponse();

        let request: Request;

        try {
            request = await this.io.readRequest();
        } catch (err) {
            await this.io.closeResponse();
            throw err;
        }

        const { uuid, commandId, args, returnCommandOutput, waitForFinish } = request;

        const warnings: string[] = [];

        const options: RequestCallbackOptions = {
            warn: (text) => warnings.push(text),
        };

        let commandPromise: Promise<unknown> | undefined;

        try {
            // Wrap in promise resolve to handle both sync and async functions
            commandPromise = Promise.resolve(requestCallback(commandId, args, options));

            let commandReturnValue = null;

            if (returnCommandOutput) {
                commandReturnValue = await commandPromise;
            } else if (waitForFinish) {
                await commandPromise;
            }

            await this.io.writeResponse({
                error: null,
                uuid,
                returnValue: commandReturnValue,
                warnings,
            });
        } catch (err) {
            await this.io.writeResponse({
                error: (err as Error).message,
                uuid,
                warnings,
            });
            commandPromise = undefined;
        }

        await this.io.closeResponse();

        if (commandPromise != null) {
            await commandPromise;
        }
    }
}
