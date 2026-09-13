export interface Command {
  id: string;
  name: string;
  execute: () => void | Promise<void>;
}

export { CmdoraProvider, useCommandPalette } from "./provider.tsx";
export type { CmdoraProviderProps, UseCommandPaletteResult } from "./provider.tsx";

export { CommandPalette } from "./command-palette/command-palette.tsx";
export type { CommandPaletteProps } from "./command-palette/command-palette.tsx";

export { CommandInput } from "./command-palette/command-input.tsx";
export type { CommandInputProps } from "./command-palette/command-input.tsx";

export { CommandList, CommandEmpty } from "./command-palette/command-list.tsx";
export type { CommandListProps, CommandEmptyProps } from "./command-palette/command-list.tsx";
