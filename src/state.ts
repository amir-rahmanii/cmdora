export interface CommandState {
  query: string;
  isOpen: boolean;
}

type Listener = () => void;

export class CommandStateStore {
  #state: CommandState = { query: "", isOpen: false };
  #listeners = new Set<Listener>();

  getState(): CommandState {
    return this.#state;
  }

  setQuery(query: string): void {
    this.#state = { ...this.#state, query };
    this.#notify();
  }

  open(): void {
    this.#state = { ...this.#state, isOpen: true };
    this.#notify();
  }

  close(): void {
    this.#state = { ...this.#state, isOpen: false };
    this.#notify();
  }

  toggle(): void {
    this.#state = { ...this.#state, isOpen: !this.#state.isOpen };
    this.#notify();
  }

  subscribe(listener: Listener): () => void {
    this.#listeners.add(listener);
    return () => {
      this.#listeners.delete(listener);
    };
  }

  #notify(): void {
    for (const listener of this.#listeners) {
      listener();
    }
  }
}
