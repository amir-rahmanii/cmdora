import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import type { Command } from "./index.ts";
import { useCommandPalette, useCommandState, type UseCommandPaletteResult } from "./provider.tsx";
import { filterCommands } from "./search.ts";

function cn(...classNames: Array<string | undefined | false | null>): string {
  return classNames.filter(Boolean).join(" ");
}

const BACKDROP_STRUCTURAL_CLASS_NAME =
  "cmdora-backdrop fixed inset-0 z-50 flex items-center justify-center";
const BACKDROP_DEFAULT_VISUAL_CLASS_NAME = "bg-black/40 backdrop-blur-md";

const CommandPaletteContext = createContext<UseCommandPaletteResult | null>(null);

function useCommandPaletteContext(hookName: string): UseCommandPaletteResult {
  const context = useContext(CommandPaletteContext);
  if (context === null) {
    throw new Error(`${hookName} must be used within a CommandPalette`);
  }
  return context;
}

export interface CommandPaletteProps extends ComponentPropsWithoutRef<"div"> {
  commands: Command[];
  backdropClassName?: string;
}

export function CommandPalette({ commands, backdropClassName, ...rest }: CommandPaletteProps) {
  const palette = useCommandPalette(commands);
  const state = useCommandState();
  const query = useSyncExternalStore(
    (listener) => state.subscribe(listener),
    () => state.getState().query,
  );

  const filteredCommands = useMemo(
    () => filterCommands(palette.commands, query),
    [palette.commands, query],
  );

  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef(palette.close);
  closeRef.current = palette.close;

  useEffect(() => {
    if (!palette.isOpen) {
      return;
    }

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    dialogRef.current?.querySelector<HTMLInputElement>("input")?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        closeRef.current();
      }
    }

    function handlePointerDown(event: MouseEvent): void {
      if (dialogRef.current && !dialogRef.current.contains(event.target as Node)) {
        closeRef.current();
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
  }, [palette.isOpen]);

  if (!palette.isOpen) {
    return null;
  }

  return createPortal(
    <div
      className={cn(
        BACKDROP_STRUCTURAL_CLASS_NAME,
        BACKDROP_DEFAULT_VISUAL_CLASS_NAME,
        backdropClassName,
      )}
    >
      <CommandPaletteContext.Provider value={{ ...palette, commands: filteredCommands }}>
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          {...rest}
          ref={dialogRef}
        />
      </CommandPaletteContext.Provider>
    </div>,
    document.body,
  );
}

export interface CommandInputProps extends Omit<ComponentPropsWithoutRef<"input">, "value"> {}

export function CommandInput({ onChange, type = "text", ...rest }: CommandInputProps) {
  const state = useCommandState();
  const query = useSyncExternalStore(
    (listener) => state.subscribe(listener),
    () => state.getState().query,
  );

  return (
    <input
      {...rest}
      type={type}
      value={query}
      onChange={(event) => {
        state.setQuery(event.target.value);
        onChange?.(event);
      }}
    />
  );
}

export interface CommandListProps extends Omit<ComponentPropsWithoutRef<"div">, "children"> {}

export function CommandList({ role = "listbox", ...rest }: CommandListProps) {
  const { commands, close } = useCommandPaletteContext("CommandList");

  return (
    <div role={role} {...rest}>
      {commands.map((command) => (
        <CommandListItem key={command.id} command={command} close={close} />
      ))}
    </div>
  );
}

interface CommandListItemProps {
  command: Command;
  close: () => void;
}

function CommandListItem({ command, close }: CommandListItemProps) {
  function select(): void {
    void command.execute();
    close();
  }

  return (
    <div
      role="option"
      tabIndex={0}
      onClick={select}
      onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      }}
    >
      {command.name}
    </div>
  );
}
