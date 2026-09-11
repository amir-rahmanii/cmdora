export interface CommandState {
  query: string;
  selectedIndex: number;
  isOpen: boolean;
}

type Listener = () => void;

function createInitialState(): CommandState {
  return {
    query: "",
    selectedIndex: 0,
    isOpen: false,
  };
}

export class CommandStateStore {
  #state: CommandState = createInitialState();
  #listeners = new Set<Listener>();

  getState(): CommandState {
    return this.#state;
  }

  setQuery(query: string): void {
    this.#state = { ...this.#state, query, selectedIndex: 0 };
    this.#notify();
  }

  setSelectedIndex(index: number): void {
    this.#state = { ...this.#state, selectedIndex: index };
    this.#notify();
  }

  setOpen(isOpen: boolean): void {
    this.#state = { ...this.#state, isOpen };
    this.#notify();
  }

  reset(): void {
    this.#state = createInitialState();
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
