import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { Command } from "./index.ts";
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

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      const state = stateRef.current;
      if (state === null) {
        return;
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        state.toggle();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

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

export interface UseCommandPaletteResult {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useCommandPalette(commands: Command[] = []): UseCommandPaletteResult {
  const registry = useCmdora();
  const state = useCommandState();

  useEffect(() => {
    // Registering is idempotent: if another useCommandPalette() call (e.g. in
    // a parent or a nested CommandPalette) already registered a given id,
    // this instance skips it and won't be the one to unregister it either.
    const registeredIds: string[] = [];
    for (const command of commands) {
      if (registry.get(command.id) === undefined) {
        registry.register(command);
        registeredIds.push(command.id);
      }
    }
    return () => {
      for (const id of registeredIds) {
        registry.unregister(id);
      }
    };
  }, [registry, commands]);

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
