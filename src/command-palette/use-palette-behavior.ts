import { useEffect, type RefObject } from "react";
import type { Command } from "../index.ts";
import { stepActiveId } from "./navigation.ts";

export interface UsePaletteBehaviorParams {
  isOpen: boolean;
  dialogRef: RefObject<HTMLDivElement | null>;
  commandsRef: RefObject<Command[]>;
  activeIdRef: RefObject<string | null>;
  setActiveId: (id: string) => void;
  close: () => void;
}

export function usePaletteBehavior({
  isOpen,
  dialogRef,
  commandsRef,
  activeIdRef,
  setActiveId,
  close,
}: UsePaletteBehaviorParams): void {
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
        close();
        return;
      }

      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const next = stepActiveId(
          commandsRef.current,
          activeIdRef.current,
          event.key === "ArrowDown" ? 1 : -1,
        );
        if (next !== null) {
          setActiveId(next);
        }
        return;
      }

      if (event.key === "Enter") {
        const command = commandsRef.current.find((c) => c.id === activeIdRef.current);
        if (command && !command.disabled) {
          event.preventDefault();
          void command.execute();
          close();
        }
      }
    }

    function handlePointerDown(event: MouseEvent): void {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        close();
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
  }, [isOpen, dialogRef, commandsRef, activeIdRef, setActiveId, close]);
}
