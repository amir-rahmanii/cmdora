export interface Command {
  id: string;
  name: string;
  execute: () => void | Promise<void>;
}

export { CmdoraProvider, useCommandPalette } from "./provider.tsx";
export type { CmdoraProviderProps, UseCommandPaletteResult } from "./provider.tsx";

export { CommandPalette, CommandInput, CommandList, CommandItem } from "./components.tsx";
export type {
  CommandPaletteProps,
  CommandInputProps,
  CommandListProps,
  CommandItemProps,
} from "./components.tsx";
