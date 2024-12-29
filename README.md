# Talon RPC server

File based RPC server compatible with the Talon community command client

## Installation

`npm install talon-rpc`

## Usage

```ts
import { NodeIo, TalonRpcServer } from "talon-rpc";

const io = new NodeIo("vscode-command-server");
const rpc = new TalonRpcServer(io, runCommand);

await io.initialize();

onKeypress(async () => {
    await rpc.executeRequest();
});
```
