import { useState } from "react";
import { CommandInput, CommandItem, CommandList, CommandPalette, type Command } from "cmdora";

export function App() {
  const [message, setMessage] = useState("No command run yet.");
  const [count, setCount] = useState(0);

  const commands: Command[] = [
    {
      id: "say-hello",
      name: "Say hello",
      execute: () => setMessage("Hello from Cmdora!"),
    },
    {
      id: "increment-counter",
      name: "Increment counter",
      execute: () => setCount((current) => current + 1),
    },
    {
      id: "toggle-dark-mode",
      name: "Toggle dark mode",
      execute: () => document.body.classList.toggle("dark"),
    },
  ];

  return (
    <main className="app">
      <h1>Cmdora Example</h1>
      <p>
        Press <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>K</kbd> to open the command palette.
      </p>

      <p>{message}</p>
      <p>Counter: {count}</p>

      <CommandPalette commands={commands} className="palette">
        <CommandInput className="palette-input" placeholder="Type a command..." autoFocus />
        <CommandList className="palette-list">
          {(command) => (
            <CommandItem command={command} className="palette-item">
              {command.name}
            </CommandItem>
          )}
        </CommandList>
      </CommandPalette>
    </main>
  );
}
