export interface Command {
  id: string;
  name: string;
  execute: () => void | Promise<void>;
}

export { CmdoraProvider, useCommandPalette } from "./provider.tsx";
export type { CmdoraProviderProps, CommandPalette } from "./provider.tsx";
