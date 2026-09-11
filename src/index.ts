export interface Command {
  id: string;
  name: string;
  execute: () => void | Promise<void>;
}

export { CommandRegistry } from "./registry.ts";
export { CommandStateStore } from "./state.ts";
export type { CommandState } from "./state.ts";
export { CmdoraProvider, useCmdora, useCommandState } from "./provider.tsx";
export type { CmdoraProviderProps } from "./provider.tsx";
