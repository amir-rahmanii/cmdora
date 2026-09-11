import { afterEach, expect, test } from "vite-plus/test";
import { act, cleanup, render, renderHook } from "@testing-library/react";
import { CmdoraProvider, useCmdora, useCommandPalette, useCommandState } from "../src/provider.tsx";
import { CommandRegistry } from "../src/registry.ts";
import { CommandStateStore } from "../src/state.ts";

afterEach(() => {
  cleanup();
});

test("useCmdora returns a CommandRegistry inside CmdoraProvider", () => {
  const { result } = renderHook(() => useCmdora(), {
    wrapper: CmdoraProvider,
  });

  expect(result.current).toBeInstanceOf(CommandRegistry);
});

test("useCmdora returns the same registry instance across re-renders", () => {
  const { result, rerender } = renderHook(() => useCmdora(), {
    wrapper: CmdoraProvider,
  });

  const first = result.current;
  rerender();

  expect(result.current).toBe(first);
});

test("useCmdora throws when used outside CmdoraProvider", () => {
  const { result } = renderHook(() => {
    try {
      return useCmdora();
    } catch (error) {
      return error;
    }
  });

  expect(result.current).toBeInstanceOf(Error);
  expect((result.current as Error).message).toBe("useCmdora must be used within a CmdoraProvider");
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

test("CmdoraProvider renders its children", () => {
  const { getByText } = render(
    <CmdoraProvider>
      <span>child</span>
    </CmdoraProvider>,
  );

  expect(getByText("child")).toBeDefined();
});
