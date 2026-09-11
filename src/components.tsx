import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ComponentPropsWithoutRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import type { Command } from "./index.ts";
import { useCommandPalette, useCommandState, type UseCommandPaletteResult } from "./provider.tsx";
import { filterCommands } from "./search.ts";

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
  /**
   * Render the palette through a React portal instead of in place.
   * Pass `true` to portal into `document.body`, or an element to portal into it directly.
   */
  portal?: boolean | Element | DocumentFragment;
}

export function CommandPalette({ commands, portal, ...rest }: CommandPaletteProps) {
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

  if (!palette.isOpen) {
    return null;
  }

  const content = (
    <CommandPaletteContext.Provider value={{ ...palette, commands: filteredCommands }}>
      <div {...rest} />
    </CommandPaletteContext.Provider>
  );

  if (!portal) {
    return content;
  }

  const container = portal === true ? document.body : portal;
  return createPortal(content, container);
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
