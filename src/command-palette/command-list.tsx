import type { ComponentPropsWithoutRef } from "react";
import type { Command } from "../index.ts";
import { useCommandPaletteContext } from "./command-palette-context.tsx";
import { cn } from "./cn.ts";

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
