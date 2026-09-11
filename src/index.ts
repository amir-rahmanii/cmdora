export interface Command {
  id: string;
  name: string;
  execute: () => void | Promise<void>;
}
