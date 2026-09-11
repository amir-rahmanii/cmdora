import { useEffect, useState } from "react";
import { CommandInput, CommandList, CommandPalette, useCommandPalette, type Command } from "cmdora";

export function App() {
  const [message, setMessage] = useState("No command run yet.");
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", isDark);
  }, [isDark]);

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
      id: "toggle-theme",
      name: "Toggle theme",
      execute: () => setIsDark((current) => !current),
    },
  ];

  const { isOpen, open, close, toggle } = useCommandPalette(commands);

  return (
    <main className="app">
      <header className="app-header">
        <span className="app-logo">⌘ Cmdora</span>
        <p className="app-description">A lightweight, headless command palette for React.</p>
      </header>

      <section className="demo-grid">
        <div className="demo-card">
          <span className="demo-card-label">Message</span>
          <p className="demo-card-value">{message}</p>
        </div>
        <div className="demo-card">
          <span className="demo-card-label">Counter</span>
          <p className="demo-card-value">{count}</p>
        </div>
        <div className="demo-card">
          <span className="demo-card-label">Theme</span>
          <p className="demo-card-value">{isDark ? "Dark" : "Light"}</p>
        </div>
      </section>

      <div className="open-controls">
        <button type="button" className="open-button" onClick={open}>
          Open Command Palette
        </button>
        {isOpen && (
          <button type="button" className="close-button" onClick={close}>
            Close
          </button>
        )}
      </div>

      <button type="button" className="hint-button" onClick={toggle}>
        Press <kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>⌘</kbd> <kbd>K</kbd> to open the command palette.
      </button>

      <p className="status-line">Command palette is currently {isOpen ? "open" : "closed"}.</p>

      <CommandPalette commands={commands} className="palette" backdropClassName="palette-backdrop">
        <CommandInput className="palette-input" placeholder="Search commands..." autoFocus />
        <CommandList className="palette-list" />
      </CommandPalette>
    </main>
  );
}
