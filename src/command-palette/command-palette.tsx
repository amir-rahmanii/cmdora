import { useEffect, useRef, useSyncExternalStore, type ComponentPropsWithoutRef } from "react";
import { createPortal } from "react-dom";
import type { Command } from "../index.ts";
import { useCommandState } from "./provider.tsx";
import { filterCommands } from "./search.ts";
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
}: CommandPaletteProps) {
  const state = useCommandState();
  const { isOpen, query } = useSyncExternalStore(
    (listener) => state.subscribe(listener),
    () => state.getState(),
  );

  const filteredCommands = filterCommands(commands, query);

  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        state.close();
      }
    }

    function handlePointerDown(event: MouseEvent): void {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        state.close();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [isOpen, state]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className={cn("cmdora-backdrop", backdropClassName)}>
      <CommandPaletteContext.Provider
        value={{ commands: filteredCommands, close: () => state.close() }}
      >
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
