import {
  createContext,
  useContext,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import type { Command } from "./index.ts";
import { useCommandPalette, useCommandState, type UseCommandPaletteResult } from "./provider.tsx";

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
}

export function CommandPalette({ commands, ...rest }: CommandPaletteProps) {
  const palette = useCommandPalette(commands);

  if (!palette.isOpen) {
    return null;
  }

  return (
    <CommandPaletteContext.Provider value={palette}>
      <div {...rest} />
    </CommandPaletteContext.Provider>
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

export interface CommandListProps extends ComponentPropsWithoutRef<"div"> {}

export function CommandList({ role = "listbox", ...rest }: CommandListProps) {
  return <div role={role} {...rest} />;
}

export interface CommandItemProps extends ComponentPropsWithoutRef<"div"> {
  command: Command;
}

export function CommandItem({
  command,
  onClick,
  onKeyDown,
  role = "option",
  tabIndex = 0,
  ...rest
}: CommandItemProps) {
  const { close } = useCommandPaletteContext("CommandItem");

  function select(): void {
    void command.execute();
    close();
  }

  return (
    <div
      role={role}
      tabIndex={tabIndex}
      {...rest}
      onClick={(event: ReactMouseEvent<HTMLDivElement>) => {
        onClick?.(event);
        select();
      }}
      onKeyDown={(event: ReactKeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event);
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          select();
        }
      }}
    />
  );
}
