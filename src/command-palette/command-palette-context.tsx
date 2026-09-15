import { createContext, useContext } from "react";
import type { Command } from "../index.ts";

export interface CommandPaletteContextValue {
  commands: Command[];
  close: () => void;
  activeId: string | null;
  setActiveId: (id: string) => void;
}

export const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPaletteContext(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext);
  if (context === null) {
    throw new Error("CommandList must be used within a CommandPalette");
  }
  return context;
}
