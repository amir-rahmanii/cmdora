export interface Command {
  id: string;
  name: string;
  execute: () => void | Promise<void>;
}

export { CmdoraProvider, useCommandPalette } from "./provider.tsx";
export type { CmdoraProviderProps, UseCommandPaletteResult } from "./provider.tsx";

export { CommandPalette, CommandInput, CommandList } from "./components.tsx";
export type { CommandPaletteProps, CommandInputProps, CommandListProps } from "./components.tsx";
