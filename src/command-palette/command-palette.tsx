import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { Command } from "../index.ts";
import { useCommandState } from "./state-context.ts";
import { filterCommands } from "./search.ts";
import { resolveActiveId } from "./navigation.ts";
import { usePaletteBehavior } from "./use-palette-behavior.ts";
import { CommandPaletteContext } from "./command-palette-context.tsx";
import { cn } from "./cn.ts";
import "../styles.css";

export interface CommandPaletteProps extends ComponentPropsWithoutRef<"div"> {
  commands: Command[];
  backdropClassName?: string;
}

export function CommandPalette({
  commands,
  backdropClassName,
  className,
  ...rest
}: CommandPaletteProps): ReactNode {
  const state = useCommandState();
  const { isOpen, query } = useSyncExternalStore(
    (listener) => state.subscribe(listener),
    () => state.getState(),
  );

  const filteredCommands = filterCommands(commands, query);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  const [rawActiveId, setRawActiveId] = useState<string | null>(null);
  const activeId = resolveActiveId(filteredCommands, rawActiveId);

  const commandsRef = useRef(filteredCommands);
  const activeIdRef = useRef(activeId);

  useEffect(() => {
    commandsRef.current = filteredCommands;
  }, [filteredCommands]);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const close = useCallback(() => state.close(), [state]);

  usePaletteBehavior({
    isOpen,
    dialogRef,
    commandsRef,
    activeIdRef,
    setActiveId: setRawActiveId,
    close,
  });

  const contextValue = useMemo(
    () => ({
      commands: filteredCommands,
      close,
      activeId,
      setActiveId: setRawActiveId,
    }),
    [filteredCommands, close, activeId, setRawActiveId],
  );

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={cn("cmdora-backdrop", backdropClassName)}>
      <CommandPaletteContext.Provider value={contextValue}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          {...rest}
          className={cn("cmdora-dialog", className)}
          ref={dialogRef}
        />
      </CommandPaletteContext.Provider>
    </div>,
    document.body,
  );
}
