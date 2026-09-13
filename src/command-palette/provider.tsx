import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { CommandStateStore } from "./state.ts";

const CommandStateContext = createContext<CommandStateStore | null>(null);

export interface CmdoraProviderProps {
  children?: ReactNode;
}

export function CmdoraProvider({ children }: CmdoraProviderProps) {
  const stateRef = useRef<CommandStateStore | null>(null);
  if (stateRef.current === null) {
    stateRef.current = new CommandStateStore();
  }
  const state = stateRef.current;

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        state.toggle();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [state]);

  return <CommandStateContext.Provider value={state}>{children}</CommandStateContext.Provider>;
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
