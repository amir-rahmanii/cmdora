import { createContext, useContext, useSyncExternalStore } from "react";
import type { CommandStateStore } from "./state.ts";

export const CommandStateContext = createContext<CommandStateStore | null>(null);

export function useCommandState(): CommandStateStore {
  const state = useContext(CommandStateContext);
  if (state === null) {
    throw new Error("useCommandState must be used within a CmdoraProvider");
  }
  return state;
}

export interface UseCommandPaletteResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useCommandPalette(): UseCommandPaletteResult {
  const state = useCommandState();
  const isOpen = useSyncExternalStore(
    (listener) => state.subscribe(listener),
    () => state.getState().isOpen,
  );

  return {
    isOpen,
    open: () => state.open(),
    close: () => state.close(),
    toggle: () => state.toggle(),
  };
}
