import { afterEach, expect, it } from "vite-plus/test";
import { act, cleanup, fireEvent, render, renderHook } from "@testing-library/react";
import { CmdoraProvider } from "../src/command-palette/provider.tsx";
import { useCommandPalette, useCommandState } from "../src/command-palette/state-context.ts";
import { CommandStateStore } from "../src/command-palette/state.ts";

afterEach(() => {
  cleanup();
});

it("useCommandState returns a CommandStateStore inside CmdoraProvider", () => {
  const { result } = renderHook(() => useCommandState(), {
    wrapper: CmdoraProvider,
  });

  expect(result.current).toBeInstanceOf(CommandStateStore);
});

it("useCommandState returns the same store instance across re-renders", () => {
  const { result, rerender } = renderHook(() => useCommandState(), {
    wrapper: CmdoraProvider,
  });

  const first = result.current;
  rerender();

  expect(result.current).toBe(first);
});

it("useCommandState throws when used outside CmdoraProvider", () => {
  const { result } = renderHook(() => {
    try {
      return useCommandState();
    } catch (error) {
      return error;
    }
  });

  expect(result.current).toBeInstanceOf(Error);
  expect((result.current as Error).message).toBe(
    "useCommandState must be used within a CmdoraProvider",
  );
});

it("useCommandPalette starts closed", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  expect(result.current.isOpen).toBe(false);
});

it("useCommandPalette open sets isOpen to true", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    result.current.open();
  });

  expect(result.current.isOpen).toBe(true);
});

it("useCommandPalette close sets isOpen to false", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    result.current.open();
  });
  act(() => {
    result.current.close();
  });

  expect(result.current.isOpen).toBe(false);
});

it("useCommandPalette toggle switches isOpen", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    result.current.toggle();
  });
  expect(result.current.isOpen).toBe(true);

  act(() => {
    result.current.toggle();
  });
  expect(result.current.isOpen).toBe(false);
});

it("useCommandPalette throws when used outside CmdoraProvider", () => {
  const { result } = renderHook(() => {
    try {
      return useCommandPalette();
    } catch (error) {
      return error;
    }
  });

  expect(result.current).toBeInstanceOf(Error);
});

it("Ctrl+K toggles the palette open", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  });

  expect(result.current.isOpen).toBe(true);
});

it("Cmd+K (metaKey) toggles the palette open", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    fireEvent.keyDown(document, { key: "k", metaKey: true });
  });

  expect(result.current.isOpen).toBe(true);
});

it("Ctrl+K twice toggles the palette closed again", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  });
  act(() => {
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  });

  expect(result.current.isOpen).toBe(false);
});

it("K without Ctrl/Cmd does not toggle the palette", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    fireEvent.keyDown(document, { key: "k" });
  });

  expect(result.current.isOpen).toBe(false);
});

it("Ctrl+K prevents the browser default action", () => {
  renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  const event = new KeyboardEvent("keydown", {
    key: "k",
    ctrlKey: true,
    cancelable: true,
  });

  act(() => {
    document.dispatchEvent(event);
  });

  expect(event.defaultPrevented).toBe(true);
});

it("Ctrl+K listener is removed after unmount", () => {
  const { result, unmount } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  unmount();

  const event = new KeyboardEvent("keydown", {
    key: "k",
    ctrlKey: true,
    cancelable: true,
  });

  act(() => {
    document.dispatchEvent(event);
  });

  expect(event.defaultPrevented).toBe(false);
  expect(result.current.isOpen).toBe(false);
});

it("CmdoraProvider renders its children", () => {
  const { getByText } = render(
    <CmdoraProvider>
      <span>child</span>
    </CmdoraProvider>,
  );

  expect(getByText("child")).toBeDefined();
});
