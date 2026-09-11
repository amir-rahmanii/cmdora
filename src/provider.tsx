import { createContext, useContext, useRef, type ReactNode } from "react";
import { CommandRegistry } from "./registry.ts";
import { CommandStateStore } from "./state.ts";

const CmdoraContext = createContext<CommandRegistry | null>(null);
const CommandStateContext = createContext<CommandStateStore | null>(null);

export interface CmdoraProviderProps {
  children?: ReactNode;
}

export function CmdoraProvider({ children }: CmdoraProviderProps) {
  const registryRef = useRef<CommandRegistry | null>(null);
  if (registryRef.current === null) {
    registryRef.current = new CommandRegistry();
  }

  const stateRef = useRef<CommandStateStore | null>(null);
  if (stateRef.current === null) {
    stateRef.current = new CommandStateStore();
  }

  return (
    <CmdoraContext.Provider value={registryRef.current}>
      <CommandStateContext.Provider value={stateRef.current}>
        {children}
      </CommandStateContext.Provider>
    </CmdoraContext.Provider>
  );
}

export function useCmdora(): CommandRegistry {
  const registry = useContext(CmdoraContext);
  if (registry === null) {
    throw new Error("useCmdora must be used within a CmdoraProvider");
  }
  return registry;
}

export function useCommandState(): CommandStateStore {
  const state = useContext(CommandStateContext);
  if (state === null) {
    throw new Error("useCommandState must be used within a CmdoraProvider");
  }
  return state;
}
