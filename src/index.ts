export interface Command {
  id: string;
  name: string;
  execute: () => void | Promise<void>;
}

export { CommandRegistry } from "./registry.ts";
