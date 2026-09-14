import type { ComponentPropsWithoutRef } from "react";
import type { Command } from "../index.ts";
import { useCommandPaletteContext } from "./command-palette-context.tsx";
import { cn } from "./cn.ts";

export interface CommandListProps extends ComponentPropsWithoutRef<"div"> {
  itemClassName?: string;
}

export function CommandList({ className, itemClassName, children, ...rest }: CommandListProps) {
  const { commands, close } = useCommandPaletteContext();

  return (
    <div {...rest} className={cn("cmdora-list", className)}>
      {commands.length === 0
        ? (children ?? <CommandEmpty>No commands found</CommandEmpty>)
        : commands.map((command) => (
            <CommandListItem
              key={command.id}
              command={command}
              close={close}
              className={itemClassName}
            />
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
  className?: string;
}

function CommandListItem({ command, close, className }: CommandListItemProps) {
  function select(): void {
    void command.execute();
    close();
  }

  return (
    <button type="button" className={cn("cmdora-item", className)} onClick={select}>
      {command.name}
    </button>
  );
}
