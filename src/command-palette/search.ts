import type { Command } from "../index.ts";

export function filterCommands(commands: Command[], query: string): Command[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery === "") {
    return commands;
  }

  return commands.filter((command) => command.name.toLowerCase().includes(normalizedQuery));
}
