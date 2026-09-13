import { afterEach, expect, test } from "vite-plus/test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { CommandInput } from "./command-input.tsx";
import { CommandPalette } from "./command-palette.tsx";
import { CmdoraProvider } from "../provider.tsx";
import type { Command } from "../index.ts";

afterEach(() => {
  cleanup();
  document.body.style.overflow = "";
});

function makeCommand(id: string): Command {
  return { id, name: id, execute: () => {} };
}

function openPalette(): void {
  act(() => {
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  });
}

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

test("CommandInput calls the consumer's onChange handler", () => {
  const commands = [makeCommand("a")];
  let receivedValue: string | undefined;

  const { getByTestId } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandInput
          data-testid="input"
          onChange={(event) => {
            receivedValue = event.target.value;
          }}
        />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  fireEvent.change(getByTestId("input"), { target: { value: "hello" } });

  expect(receivedValue).toBe("hello");
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

test("CommandInput renders a plain input with no built-in icon or wrapper", () => {
  const commands = [makeCommand("a")];

  const { getByTestId } = render(
    <CmdoraProvider>
      <CommandPalette commands={commands}>
        <CommandInput data-testid="input" />
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const input = getByTestId("input");
  expect(input.tagName).toBe("INPUT");
  expect(document.body.querySelector("svg")).toBeNull();
});
