import { afterEach, expect, test } from "vite-plus/test";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { CommandInput, CommandItem, CommandList, CommandPalette } from "../src/components.tsx";
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

test("CommandItem executes its command and closes the palette on click", () => {
  let executed = false;
  const command = makeCommand("a", () => {
    executed = true;
  });

  const { container, getByText } = render(
    <CmdoraProvider>
      <CommandPalette commands={[command]} data-testid="palette">
        <CommandList>
          <CommandItem command={command}>Item A</CommandItem>
        </CommandList>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  act(() => {
    fireEvent.click(getByText("Item A"));
  });

  expect(executed).toBe(true);
  expect(container.querySelector('[data-testid="palette"]')).toBeNull();
});

test("CommandItem executes its command on Enter key", () => {
  let executed = false;
  const command = makeCommand("a", () => {
    executed = true;
  });

  const { getByText } = render(
    <CmdoraProvider>
      <CommandPalette commands={[command]}>
        <CommandList>
          <CommandItem command={command}>Item A</CommandItem>
        </CommandList>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  act(() => {
    fireEvent.keyDown(getByText("Item A"), { key: "Enter" });
  });

  expect(executed).toBe(true);
});

test("CommandItem is focusable and has an option role by default", () => {
  const command = makeCommand("a");

  const { getByText } = render(
    <CmdoraProvider>
      <CommandPalette commands={[command]}>
        <CommandList>
          <CommandItem command={command}>Item A</CommandItem>
        </CommandList>
      </CommandPalette>
    </CmdoraProvider>,
  );

  openPalette();

  const item = getByText("Item A");
  expect(item.getAttribute("role")).toBe("option");
  expect(item.getAttribute("tabindex")).toBe("0");
});

test("CommandItem throws when used outside a CommandPalette", () => {
  const command = makeCommand("a");

  expect(() => render(<CommandItem command={command}>Item A</CommandItem>)).toThrow(
    "CommandItem must be used within a CommandPalette",
  );
});
