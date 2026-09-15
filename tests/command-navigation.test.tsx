import { afterEach, expect, it } from "vite-plus/test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { CommandPalette } from "../src/command-palette/command-palette.tsx";
import { CommandInput } from "../src/command-palette/command-input.tsx";
import { CommandList } from "../src/command-palette/command-list.tsx";
import { CmdoraProvider } from "../src/command-palette/provider.tsx";
import type { Command } from "../src/index.ts";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

function namedCommand(id: string, name: string, disabled?: boolean): Command {
  return { id, name, execute: () => {}, disabled };
}

function openPalette(): void {
  act(() => {
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  });
}

function arrowDown(): void {
  act(() => {
    fireEvent.keyDown(document, { key: "ArrowDown" });
  });
}

function arrowUp(): void {
  act(() => {
    fireEvent.keyDown(document, { key: "ArrowUp" });
  });
}

function pressEnter(): void {
  act(() => {
    fireEvent.keyDown(document, { key: "Enter" });
  });
}

function renderPalette(commands: Command[]) {
  const utils = render(
    <CmdoraProvider>
      <CommandPalette commands={commands} data-testid="palette">
        <CommandInput data-testid="input" />
        <CommandList data-testid="list" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  return utils;
}

function activeNames(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll('[data-active="true"]')).map(
    (el) => el.textContent ?? "",
  );
}

it("the first command is active by default", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByText, getByTestId } = renderPalette(commands);

  expect(getByText("Say hello").getAttribute("data-active")).toBe("true");
  expect(activeNames(getByTestId("list"))).toEqual(["Say hello"]);
});

it("ArrowDown moves the active item to the next command", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByText } = renderPalette(commands);

  arrowDown();

  expect(getByText("Say hello").getAttribute("data-active")).toBe("false");
  expect(getByText("Increment counter").getAttribute("data-active")).toBe("true");
});

it("ArrowUp moves the active item to the previous command", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByText } = renderPalette(commands);

  arrowDown();
  arrowDown();
  arrowUp();

  expect(getByText("Increment counter").getAttribute("data-active")).toBe("true");
});

it("ArrowDown wraps from the last item to the first item", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByText } = renderPalette(commands);

  arrowDown();
  arrowDown();
  arrowDown();

  expect(getByText("Say hello").getAttribute("data-active")).toBe("true");
});

it("ArrowUp wraps from the first item to the last item", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByText } = renderPalette(commands);

  arrowUp();

  expect(getByText("Toggle dark mode").getAttribute("data-active")).toBe("true");
});

it("keyboard navigation skips disabled commands", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter", true),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByText } = renderPalette(commands);

  arrowDown();

  expect(getByText("Increment counter").getAttribute("data-active")).toBe("false");
  expect(getByText("Toggle dark mode").getAttribute("data-active")).toBe("true");
});

it("navigation never lands on a disabled command when wrapping", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode", true),
  ];

  const { getByText } = renderPalette(commands);

  arrowUp();

  expect(getByText("Toggle dark mode").getAttribute("data-active")).toBe("false");
  expect(getByText("Increment counter").getAttribute("data-active")).toBe("true");
});

it("Enter executes the active command and closes the palette", () => {
  let executed: string | null = null;
  const commands = [
    { id: "a", name: "Say hello", execute: () => (executed = "a") },
    { id: "b", name: "Increment counter", execute: () => (executed = "b") },
  ];

  renderPalette(commands);

  arrowDown();
  pressEnter();

  expect(executed).toBe("b");
  expect(document.body.querySelector('[data-testid="palette"]')).toBeNull();
});

it("Enter does nothing when every command is disabled", () => {
  let executed = false;
  const commands = [
    { id: "a", name: "Say hello", execute: () => (executed = true), disabled: true },
    { id: "b", name: "Increment counter", execute: () => (executed = true), disabled: true },
  ];

  renderPalette(commands);
  pressEnter();

  expect(executed).toBe(false);
  expect(document.body.querySelector('[data-testid="palette"]')).not.toBeNull();
});

it("hovering a command with the mouse syncs the active state with the keyboard", () => {
  const commands = [
    namedCommand("a", "Say hello"),
    namedCommand("b", "Increment counter"),
    namedCommand("c", "Toggle dark mode"),
  ];

  const { getByText } = renderPalette(commands);

  act(() => {
    fireEvent.mouseEnter(getByText("Toggle dark mode"));
  });

  expect(getByText("Toggle dark mode").getAttribute("data-active")).toBe("true");
  expect(getByText("Say hello").getAttribute("data-active")).toBe("false");

  arrowUp();

  expect(getByText("Increment counter").getAttribute("data-active")).toBe("true");
});

it("clicking a command executes it, and hover state does not linger after re-render", () => {
  let executed: string | null = null;
  const commands = [
    { id: "a", name: "Say hello", execute: () => (executed = "a") },
    { id: "b", name: "Increment counter", execute: () => (executed = "b") },
  ];

  const { getByText } = renderPalette(commands);

  act(() => {
    fireEvent.mouseEnter(getByText("Increment counter"));
    fireEvent.click(getByText("Increment counter"));
  });

  expect(executed).toBe("b");
});

it("inactive items do not carry a true active state", () => {
  const commands = [namedCommand("a", "Say hello"), namedCommand("b", "Increment counter")];

  const { getByText } = renderPalette(commands);

  expect(getByText("Increment counter").getAttribute("data-active")).toBe("false");
});

it("ArrowDown/ArrowUp do not interfere with typing in the input", () => {
  const commands = [namedCommand("a", "Say hello"), namedCommand("b", "Increment counter")];

  const { getByTestId } = renderPalette(commands);
  const input = getByTestId("input") as HTMLInputElement;

  fireEvent.change(input, { target: { value: "hello" } });
  arrowDown();

  expect(input.value).toBe("hello");
  expect(document.activeElement).toBe(input);
});
