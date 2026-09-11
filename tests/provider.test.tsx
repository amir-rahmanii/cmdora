import { afterEach, expect, test } from "vite-plus/test";
import { cleanup, render, renderHook } from "@testing-library/react";
import { CmdoraProvider, useCmdora } from "../src/provider.tsx";
import { CommandRegistry } from "../src/registry.ts";

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

test("CmdoraProvider renders its children", () => {
  const { getByText } = render(
    <CmdoraProvider>
      <span>child</span>
    </CmdoraProvider>,
  );

  expect(getByText("child")).toBeDefined();
});
