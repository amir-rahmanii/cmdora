import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
} from "react";
import { createPortal } from "react-dom";
import type { Command } from "./index.ts";
import { useCommandState } from "./provider.tsx";
import { filterCommands } from "./search.ts";
import "./styles.css";

function cn(...classNames: Array<string | undefined | false | null>): string {
  return classNames.filter(Boolean).join(" ");
}

interface CommandPaletteContextValue {
  commands: Command[];
  close: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

function useCommandPaletteContext(): CommandPaletteContextValue {
  const context = useContext(CommandPaletteContext);
  if (context === null) {
    throw new Error("CommandList must be used within a CommandPalette");
  }
  return context;
}

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

export interface CommandInputProps extends Omit<ComponentPropsWithoutRef<"input">, "value"> {}

export function CommandInput({ onChange, type = "text", className, ...rest }: CommandInputProps) {
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
      className={cn("cmdora-input", className)}
      onChange={(event) => {
        state.setQuery(event.target.value);
        onChange?.(event);
      }}
    />
  );
}

export interface CommandListProps extends ComponentPropsWithoutRef<"div"> {}

export function CommandList({ className, children, ...rest }: CommandListProps) {
  const { commands, close } = useCommandPaletteContext();

  return (
    <div {...rest} className={cn("cmdora-list", className)}>
      {commands.length === 0
        ? (children ?? <CommandEmpty>No commands found</CommandEmpty>)
        : commands.map((command) => (
            <CommandListItem key={command.id} command={command} close={close} />
          ))}
    </div>
  );
}

export interface CommandEmptyProps extends ComponentPropsWithoutRef<"p"> {}

export function CommandEmpty({ className, ...rest }: CommandEmptyProps) {
  return <p {...rest} className={cn("cmdora-empty", className)} />;
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
    <button type="button" className="cmdora-item" onClick={select}>
      {command.name}
    </button>
  );
}
