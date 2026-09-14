import { useEffect, useState, type ReactNode } from "react";
import { CommandStateStore } from "./state.ts";
import { CommandStateContext } from "./state-context.ts";

export interface CmdoraProviderProps {
  children?: ReactNode;
}

export function CmdoraProvider({ children }: CmdoraProviderProps): ReactNode {
  const [state, setState] = useState(() => new CommandStateStore());

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
