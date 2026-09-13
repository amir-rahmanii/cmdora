import { afterEach, expect, test } from "vite-plus/test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { CommandEmpty, CommandList } from "../src/command-palette/command-list.tsx";
import { CommandInput } from "../src/command-palette/command-input.tsx";
import { CommandPalette } from "../src/command-palette/command-palette.tsx";
import { CmdoraProvider } from "../src/command-palette/provider.tsx";
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

test("CommandList renders each command as a real, natively focusable button", () => {
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
  expect(item.tagName).toBe("BUTTON");
});

test("CommandList throws when used outside a CommandPalette", () => {
  expect(() => render(<CommandList />)).toThrow("CommandList must be used within a CommandPalette");
});

test("CommandList shows an empty state when there are no commands to show", () => {
  render(
    <CmdoraProvider>
      <CommandPalette commands={[]}>
        <CommandList />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(document.body.textContent).toContain("No commands found");
});

test("consumers can replace the default empty state via CommandList children", () => {
  render(
    <CmdoraProvider>
      <CommandPalette commands={[]}>
        <CommandList>
          <CommandEmpty>Nothing to show here</CommandEmpty>
        </CommandList>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(document.body.textContent).toContain("Nothing to show here");
  expect(document.body.textContent).not.toContain("No commands found");
});

test("consumers can replace the empty state with completely custom content", () => {
  render(
    <CmdoraProvider>
      <CommandPalette commands={[]}>
        <CommandList>
          <span>custom empty markup</span>
        </CommandList>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(document.body.textContent).toContain("custom empty markup");
});

test("CommandEmpty renders with the default class and supports a custom className", () => {
  render(
    <CmdoraProvider>
      <CommandPalette commands={[]}>
        <CommandList>
          <CommandEmpty className="my-empty" data-testid="empty" />
        </CommandList>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const empty = document.body.querySelector('[data-testid="empty"]');
  expect(empty?.className).toContain("cmdora-empty");
  expect(empty?.className).toContain("my-empty");
});

test("CommandList does not show the empty state when commands match", () => {
  const commands = [namedCommand("a", "Say hello")];

  render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandList />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  expect(document.body.textContent).not.toContain("No commands found");
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

test("unmatched query shows the empty state instead of the list", () => {
  const commands = [namedCommand("a", "Say hello"), namedCommand("b", "Toggle dark mode")];

  const { getByTestId, getByText, queryByRole } = renderSearchablePalette(commands);

  fireEvent.change(getByTestId("input"), { target: { value: "nonexistent" } });

  expect(getByText("No commands found")).toBeDefined();
  expect(queryByRole("button")).toBeNull();
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
