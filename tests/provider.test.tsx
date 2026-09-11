import { afterEach, expect, test } from "vite-plus/test";
import { act, cleanup, fireEvent, render, renderHook } from "@testing-library/react";
import { CmdoraProvider, useCommandPalette, useCommandState } from "../src/provider.tsx";
import { CommandStateStore } from "../src/state.ts";

afterEach(() => {
  cleanup();
});

test("useCommandState returns a CommandStateStore inside CmdoraProvider", () => {
  const { result } = renderHook(() => useCommandState(), {
    wrapper: CmdoraProvider,
  });

  expect(result.current).toBeInstanceOf(CommandStateStore);
});

test("useCommandState returns the same store instance across re-renders", () => {
  const { result, rerender } = renderHook(() => useCommandState(), {
    wrapper: CmdoraProvider,
  });

  const first = result.current;
  rerender();

  expect(result.current).toBe(first);
});

test("useCommandState throws when used outside CmdoraProvider", () => {
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

test("useCommandPalette starts closed", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  expect(result.current.isOpen).toBe(false);
});

test("useCommandPalette open sets isOpen to true", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    result.current.open();
  });

  expect(result.current.isOpen).toBe(true);
});

test("useCommandPalette close sets isOpen to false", () => {
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

test("useCommandPalette toggle switches isOpen", () => {
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

test("useCommandPalette throws when used outside CmdoraProvider", () => {
  const { result } = renderHook(() => {
    try {
      return useCommandPalette();
    } catch (error) {
      return error;
    }
  });

  expect(result.current).toBeInstanceOf(Error);
});

test("Ctrl+K toggles the palette open", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    fireEvent.keyDown(document, { key: "k", ctrlKey: true });
  });

  expect(result.current.isOpen).toBe(true);
});

test("Cmd+K (metaKey) toggles the palette open", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    fireEvent.keyDown(document, { key: "k", metaKey: true });
  });

  expect(result.current.isOpen).toBe(true);
});

test("Ctrl+K twice toggles the palette closed again", () => {
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

test("K without Ctrl/Cmd does not toggle the palette", () => {
  const { result } = renderHook(() => useCommandPalette(), {
    wrapper: CmdoraProvider,
  });

  act(() => {
    fireEvent.keyDown(document, { key: "k" });
  });

  expect(result.current.isOpen).toBe(false);
});

test("Ctrl+K prevents the browser default action", () => {
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

test("Ctrl+K listener is removed after unmount", () => {
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

test("CmdoraProvider renders its children", () => {
  const { getByText } = render(
    <CmdoraProvider>
      <span>child</span>
    </CmdoraProvider>,
  );

  expect(getByText("child")).toBeDefined();
});
