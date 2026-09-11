import { afterEach, expect, test } from "vite-plus/test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { CommandInput, CommandList, CommandPalette } from "../src/components.tsx";
import { CmdoraProvider } from "../src/provider.tsx";
import type { Command } from "../src/index.ts";

afterEach(() => {
  cleanup();
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

  const { container } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette" />
    </CmdoraProvider>,
  );

  expect(container.querySelector('[data-testid="palette"]')).toBeNull();
});

test("CommandPalette renders its children once opened", () => {
  const commands = [makeCommand("a")];

  const { container } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette">
        <span>content</span>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(container.querySelector('[data-testid="palette"]')).not.toBeNull();
  expect(container.textContent).toContain("content");
});

test("CommandPalette forwards className and native div attributes", () => {
  const commands = [makeCommand("a")];

  const { container } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands} className="my-palette" aria-label="Commands" />
    </CmdoraProvider>,
  );

  openPalette();

  const palette = container.querySelector(".my-palette");
  expect(palette).not.toBeNull();
  expect(palette?.getAttribute("aria-label")).toBe("Commands");
});

test("CommandList renders a listbox by default", () => {
  const commands = [makeCommand("a")];

  const { container } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandList data-testid="list" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const list = container.querySelector('[data-testid="list"]');
  expect(list?.getAttribute("role")).toBe("listbox");
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

  const { container, getByText } = render(
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
  expect(container.querySelector('[data-testid="palette"]')).toBeNull();
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
