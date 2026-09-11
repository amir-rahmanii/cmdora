import { createContext, useContext, useRef, type ReactNode } from "react";
import { CommandRegistry } from "./registry.ts";

const CmdoraContext = createContext<CommandRegistry | null>(null);

export interface CmdoraProviderProps {
  children?: ReactNode;
}

export function CmdoraProvider({ children }: CmdoraProviderProps) {
  const registryRef = useRef<CommandRegistry | null>(null);
  if (registryRef.current === null) {
    registryRef.current = new CommandRegistry();
  }

  return <CmdoraContext.Provider value={registryRef.current}>{children}</CmdoraContext.Provider>;
}

export function useCmdora(): CommandRegistry {
  const registry = useContext(CmdoraContext);
  if (registry === null) {
    throw new Error("useCmdora must be used within a CmdoraProvider");
  }
  return registry;
}
