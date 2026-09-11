import { afterEach, expect, test } from "vite-plus/test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { CommandInput, CommandList, CommandPalette } from "../src/components.tsx";
import { CmdoraProvider } from "../src/provider.tsx";
import type { Command } from "../src/index.ts";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

function makeCommand(id: string, onExecute?: () => void): Command {
  return {
    id,
    name: id,
    execute: () => {
      onExecute?.();
    },
  };
}

function namedCommand(id: string, name: string): Command {
  return { id, name, execute: () => {} };
}

function openPalette(): void {
  act(() => {
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  });
}

test("CommandPalette renders nothing while closed", () => {
  const commands = [makeCommand("a")];

  render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette" />
    </CmdoraProvider>,
  );

  expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
});

test("CommandPalette renders its children through a portal once opened", () => {
  const commands = [makeCommand("a")];

  const { container } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette">
        <span>content</span>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const palette = document.body.querySelector('[data-testid="palette"]');
  expect(palette).not.toBeNull();
  expect(palette?.textContent).toContain("content");
  expect(container.contains(palette)).toBe(false);
});

test("CommandPalette forwards className and native div attributes", () => {
  const commands = [makeCommand("a")];

  render(
    <CmdoraProvider>
      <CommandPalette commands={commands} className="my-palette" />
    </CmdoraProvider>,
  );

  openPalette();

  const palette = document.body.querySelector(".my-palette");
  expect(palette).not.toBeNull();
});

test("CommandPalette has dialog semantics with an accessible name", () => {
  const commands = [makeCommand("a")];

  render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette" />
    </CmdoraProvider>,
  );

  openPalette();

  const palette = document.body.querySelector('[data-testid="palette"]');
  expect(palette?.getAttribute("role")).toBe("dialog");
  expect(palette?.getAttribute("aria-modal")).toBe("true");
  expect(palette?.hasAttribute("aria-label") || palette?.hasAttribute("aria-labelledby")).toBe(
    true,
  );
});

test("a custom aria-label overrides the default accessible name", () => {
  const commands = [makeCommand("a")];

  render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette" aria-label="Commands" />
    </CmdoraProvider>,
  );

  openPalette();

  const palette = document.body.querySelector('[data-testid="palette"]');
  expect(palette?.getAttribute("aria-label")).toBe("Commands");
});

test("renders a backdrop behind the dialog with the default cmdora-backdrop class", () => {
  const commands = [makeCommand("a")];

  render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette" />
    </CmdoraProvider>,
  );

  openPalette();

  const palette = document.body.querySelector('[data-testid="palette"]') as HTMLElement;
  const backdrop = palette.parentElement as HTMLElement;

  expect(backdrop.className).toContain("cmdora-backdrop");
  expect(backdrop.contains(palette)).toBe(true);
});

test("backdropClassName is accepted and merged with the default backdrop class", () => {
  const commands = [makeCommand("a")];

  render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette" backdropClassName="my-backdrop" />
    </CmdoraProvider>,
  );

  openPalette();

  const palette = document.body.querySelector('[data-testid="palette"]') as HTMLElement;
  const backdrop = palette.parentElement as HTMLElement;

  // The default class is always present, so the built-in styling still applies...
  expect(backdrop.className).toContain("cmdora-backdrop");

  // ...alongside the consumer's own class, so it can add to or override it.
  expect(backdrop.className).toContain("my-backdrop");
});

test("the dialog, input, and list carry their default cmdora-* classes", () => {
  const commands = [makeCommand("a")];

  const { getByTestId } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette">
        <CommandInput data-testid="input" />
        <CommandList data-testid="list" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(document.body.querySelector('[data-testid="palette"]')?.className).toContain(
    "cmdora-dialog",
  );
  expect(getByTestId("input").className).toContain("cmdora-input");
  expect(getByTestId("list").className).toContain("cmdora-list");
});

test("className props are merged with defaults, not replaced", () => {
  const commands = [namedCommand("a", "Say hello")];

  const { getByTestId, getByText } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette" className="my-palette">
        <CommandInput data-testid="input" className="my-input" />
        <CommandList data-testid="list" className="my-list" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const palette = document.body.querySelector('[data-testid="palette"]') as HTMLElement;
  expect(palette.className).toContain("cmdora-dialog");
  expect(palette.className).toContain("my-palette");

  const input = getByTestId("input");
  expect(input.className).toContain("cmdora-input");
  expect(input.className).toContain("my-input");

  const list = getByTestId("list");
  expect(list.className).toContain("cmdora-list");
  expect(list.className).toContain("my-list");

  expect(getByText("Say hello").className).toContain("cmdora-item");
});

test("CommandList renders a listbox by default", () => {
  const commands = [makeCommand("a")];

  const { getByTestId } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandList data-testid="list" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(getByTestId("list").getAttribute("role")).toBe("listbox");
});

test("CommandList automatically renders all commands without any consumer mapping", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByTestId } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandList data-testid="list" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(getByTestId("list").textContent).toBe("Say helloIncrement counterToggle dark mode");
});

test("CommandList renders each command with an option role", () => {
  const commands = [namedCommand("a", "Say hello")];

  const { getByText } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandList />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const item = getByText("Say hello");
  expect(item.getAttribute("role")).toBe("option");
  expect(item.getAttribute("tabindex")).toBe("0");
});

test("activating a rendered command executes it and closes the palette", () => {
  let executed = false;
  const command = makeCommand("a", () => {
    executed = true;
  });

  const { getByText } = render(
    <CmdoraProvider>
      <CommandPalette commands={[command]} data-testid="palette">
        <CommandList />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  act(() => {
    fireEvent.click(getByText("a"));
  });

  expect(executed).toBe(true);
  expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
});

test("activating a rendered command with Enter executes it", () => {
  let executed = false;
  const command = makeCommand("a", () => {
    executed = true;
  });

  const { getByText } = render(
    <CmdoraProvider>
      <CommandPalette commands={[command]}>
        <CommandList />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  act(() => {
    fireEvent.keyDown(getByText("a"), { key: "Enter" });
  });

  expect(executed).toBe(true);
});

test("CommandInput reflects and updates the shared query state", () => {
  const commands = [makeCommand("a")];

  const { getByTestId } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandInput data-testid="input" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const input = getByTestId("input") as HTMLInputElement;
  expect(input.value).toBe("");

  fireEvent.change(input, { target: { value: "hello" } });

  expect(input.value).toBe("hello");
});

test("CommandInput supports normal input props such as placeholder and autoFocus", () => {
  const commands = [makeCommand("a")];

  const { getByTestId } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandInput data-testid="input" placeholder="Type a command..." autoFocus />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const input = getByTestId("input") as HTMLInputElement;
  expect(input.placeholder).toBe("Type a command...");
});

function renderSearchablePalette(commands: Command[]) {
  const utils = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandInput data-testid="input" />
        <CommandList data-testid="list" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  return utils;
}

test("typing into CommandInput updates the query and automatically filters CommandList", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByTestId } = renderSearchablePalette(commands);
  const input = getByTestId("input") as HTMLInputElement;

  fireEvent.change(input, { target: { value: "hello" } });

  expect(input.value).toBe("hello");
  expect(getByTestId("list").textContent).toBe("Say hello");
});

test("search is case-insensitive", () => {
  const commands = [namedCommand("a", "Say hello"), namedCommand("b", "Toggle dark mode")];

  const { getByTestId } = renderSearchablePalette(commands);

  fireEvent.change(getByTestId("input"), { target: { value: "HELLO" } });

  expect(getByTestId("list").textContent).toBe("Say hello");
});

test("search trims surrounding whitespace", () => {
  const commands = [namedCommand("a", "Say hello"), namedCommand("b", "Toggle dark mode")];

  const { getByTestId } = renderSearchablePalette(commands);

  fireEvent.change(getByTestId("input"), { target: { value: "  hello  " } });

  expect(getByTestId("list").textContent).toBe("Say hello");
});

test("unmatched query renders no commands", () => {
  const commands = [namedCommand("a", "Say hello"), namedCommand("b", "Toggle dark mode")];

  const { getByTestId } = renderSearchablePalette(commands);

  fireEvent.change(getByTestId("input"), { target: { value: "nonexistent" } });

  expect(getByTestId("list").textContent).toBe("");
});

test("CommandList preserves the original command order for multiple matches", () => {
  const commands = [
    namedCommand("x", "Xylophone"),
    namedCommand("y", "Copy file"),
    namedCommand("z", "Color picker"),
  ];

  const { getByTestId } = renderSearchablePalette(commands);

  fireEvent.change(getByTestId("input"), { target: { value: "co" } });

  expect(getByTestId("list").textContent).toBe("Copy fileColor picker");
});

// Modal behavior: portal, escape, outside click, focus management, body scroll lock.

function renderModal(commands: Command[]) {
  const utils = render(
    <>
      <button data-testid="trigger">Open trigger</button>
      <CmdoraProvider>
        <CommandPalette commands={commands} data-testid="palette">
          <CommandInput data-testid="input" />
          <CommandList data-testid="list" />
        </CommandPalette>
      </CmdoraProvider>
    </>,
  );

  const trigger = utils.getByTestId("trigger") as HTMLButtonElement;
  trigger.focus();

  return { ...utils, trigger };
}

test("portaled content is removed from the DOM when the palette closes", () => {
  const commands = [makeCommand("a")];

  renderModal(commands);

  openPalette();
  expect(document.body.querySelector('[data-testid="palette"]')).not.toBeNull();

  openPalette();
  expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
});

test("portaled content is removed from the DOM on unmount", () => {
  const commands = [makeCommand("a")];

  const { unmount } = renderModal(commands);

  openPalette();
  expect(document.body.querySelector('[data-testid="palette"]')).not.toBeNull();

  unmount();

  expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
});

test("Escape closes the palette", () => {
  const commands = [makeCommand("a")];

  renderModal(commands);
  openPalette();

  expect(document.body.querySelector('[data-testid="palette"]')).not.toBeNull();

  act(() => {
    fireEvent.keyDown(document, { key: "Escape" });
  });

  expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
});

test("clicking outside the dialog closes the palette", () => {
  const commands = [makeCommand("a")];

  renderModal(commands);
  openPalette();

  act(() => {
    fireEvent.mouseDown(document.body);
  });

  expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
});

test("clicking inside the dialog does not close the palette", () => {
  const commands = [namedCommand("a", "Say hello")];

  const { getByTestId } = renderModal(commands);
  openPalette();

  act(() => {
    fireEvent.mouseDown(getByTestId("input"));
  });

  expect(document.body.querySelector('[data-testid="palette"]')).not.toBeNull();
});

test("CommandInput receives focus when the palette opens", () => {
  const commands = [makeCommand("a")];

  const { getByTestId } = renderModal(commands);
  openPalette();

  expect(document.activeElement).toBe(getByTestId("input"));
});

test("focus is restored to the previously focused element when the palette closes", () => {
  const commands = [makeCommand("a")];

  const { trigger } = renderModal(commands);

  expect(document.activeElement).toBe(trigger);

  openPalette();
  expect(document.activeElement).not.toBe(trigger);

  openPalette();
  expect(document.activeElement).toBe(trigger);
});

test("body scrolling is disabled while the palette is open and restored afterward", () => {
  const commands = [makeCommand("a")];

  document.body.style.overflow = "auto";
  renderModal(commands);

  openPalette();
  expect(document.body.style.overflow).toBe("hidden");

  openPalette();
  expect(document.body.style.overflow).toBe("auto");
});

test("repeated open/close cycles do not leak listeners or break behavior", () => {
  const commands = [makeCommand("a")];

  const { trigger } = renderModal(commands);

  for (let i = 0; i < 3; i++) {
    openPalette();
    expect(document.body.querySelector('[data-testid="palette"]')).not.toBeNull();
    act(() => {
      fireEvent.keyDown(document, { key: "Escape" });
    });
    expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
  }

  expect(document.activeElement).toBe(trigger);
  expect(document.body.style.overflow).toBe("");
});

test("unmounting while open cleans up body overflow", () => {
  const commands = [makeCommand("a")];

  const { unmount } = renderModal(commands);

  openPalette();
  expect(document.body.style.overflow).toBe("hidden");

  unmount();

  expect(document.body.style.overflow).toBe("");
});
