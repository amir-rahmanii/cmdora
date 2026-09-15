import { afterEach, expect, it } from "vite-plus/test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { CommandInput } from "../src/command-palette/command-input.tsx";
import { CommandPalette } from "../src/command-palette/command-palette.tsx";
import { CmdoraProvider } from "../src/command-palette/provider.tsx";
import type { Command } from "../src/index.ts";

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

it("CommandInput reflects and updates the shared query state", () => {
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

it("CommandInput calls the consumer's onChange handler", () => {
  const commands = [makeCommand("a")];
  let receivedValue: string | undefined = undefined;

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

it("CommandInput supports normal input props such as placeholder and autoFocus", () => {
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
