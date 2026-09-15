import { useEffect, useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import type { Command } from "../index.ts";
import { useCommandPaletteContext } from "./command-palette-context.tsx";
import { cn } from "./cn.ts";

export interface CommandListProps extends ComponentPropsWithoutRef<"div"> {
  itemClassName?: string;
}

export function CommandList({
  className,
  itemClassName,
  children,
  ...rest
}: CommandListProps): ReactNode {
  const { commands, close, activeId, setActiveId } = useCommandPaletteContext();

  return (
    <div {...rest} role="listbox" className={cn("cmdora-list", className)}>
      {commands.length === 0
        ? (children ?? <CommandEmpty>No commands found</CommandEmpty>)
        : commands.map((command) => (
            <CommandListItem
              key={command.id}
              command={command}
              close={close}
              className={itemClassName}
              active={command.id === activeId}
              onHover={() => {
                if (!command.disabled) {
                  setActiveId(command.id);
                }
              }}
            />
          ))}
    </div>
  );
}

export interface CommandEmptyProps extends ComponentPropsWithoutRef<"p"> {}

export function CommandEmpty({ className, ...rest }: CommandEmptyProps): ReactNode {
  return <p {...rest} className={cn("cmdora-empty", className)} />;
}

interface CommandListItemProps {
  command: Command;
  close: () => void;
  className?: string;
  active: boolean;
  onHover: () => void;
}

function CommandListItem({ command, close, className, active, onHover }: CommandListItemProps) {
  const itemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (active) {
      itemRef.current?.scrollIntoView?.({ block: "nearest" });
    }
  }, [active]);

  function select(): void {
    if (command.disabled) {
      return;
    }
    void command.execute();
    close();
  }

  return (
    <button
      ref={itemRef}
      type="button"
      role="option"
      aria-selected={active}
      data-active={active}
      disabled={command.disabled}
      className={cn("cmdora-item", className)}
      onClick={select}
      onMouseEnter={onHover}
    >
      {command.name}
    </button>
  );
}
