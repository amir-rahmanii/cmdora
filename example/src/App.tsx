import { useState } from "react";
import { useCommandPalette, type Command } from "cmdora";

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

  const { isOpen, close, toggle, commands: registeredCommands } = useCommandPalette(commands);

  return (
    <main className="app">
      <h1>Cmdora Example</h1>
      <p>
        Press <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> + <kbd>K</kbd>, or use the button below, to open the
        command palette.
      </p>

      <button type="button" onClick={toggle}>
        {isOpen ? "Close" : "Open"} command palette
      </button>

      <p>{message}</p>
      <p>Counter: {count}</p>

      {isOpen && (
        <div className="palette">
          <div className="palette-header">
            <span>Commands</span>
            <button type="button" onClick={close}>
              Close
            </button>
          </div>
          <ul className="palette-list">
            {registeredCommands.map((command) => (
              <li key={command.id}>
                <button
                  type="button"
                  onClick={() => {
                    void command.execute();
                    close();
                  }}
                >
                  {command.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
