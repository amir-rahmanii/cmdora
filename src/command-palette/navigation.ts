import type { Command } from "../index.ts";

export type NavigationDirection = 1 | -1;

export function resolveActiveId(commands: Command[], activeId: string | null): string | null {
  if (activeId !== null) {
    const current = commands.find((command) => command.id === activeId);
    if (current && !current.disabled) {
      return activeId;
    }
  }

  return commands.find((command) => !command.disabled)?.id ?? null;
}

export function stepActiveId(
  commands: Command[],
  activeId: string | null,
  direction: NavigationDirection,
): string | null {
  const enabledIndices = commands.reduce<number[]>((indices, command, index) => {
    if (!command.disabled) {
      indices.push(index);
    }
    return indices;
  }, []);

  if (enabledIndices.length === 0) {
    return null;
  }

  const currentIndex = activeId === null ? -1 : commands.findIndex((c) => c.id === activeId);
  const currentPos = enabledIndices.indexOf(currentIndex);

  if (currentPos === -1) {
    return commands[direction === 1 ? enabledIndices[0] : enabledIndices[enabledIndices.length - 1]]
      .id;
  }

  const nextPos = (currentPos + direction + enabledIndices.length) % enabledIndices.length;
  return commands[enabledIndices[nextPos]].id;
}
