import type { Command } from "./index.ts";

export class CommandRegistry {
  #commands = new Map<string, Command>();

  register(command: Command): void {
    if (this.#commands.has(command.id)) {
      throw new Error(`Command "${command.id}" is already registered`);
    }
    this.#commands.set(command.id, command);
  }

  unregister(id: string): void {
    this.#commands.delete(id);
  }

  get(id: string): Command | undefined {
    return this.#commands.get(id);
  }

  getAll(): Command[] {
    return [...this.#commands.values()];
  }
}
