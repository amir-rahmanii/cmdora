import { afterEach, expect, test } from "vite-plus/test";
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
