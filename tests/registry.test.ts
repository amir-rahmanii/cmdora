import { describe, expect, test } from "vite-plus/test";
import { CommandRegistry } from "../src/registry.ts";
import type { Command } from "../src/index.ts";

function makeCommand(id: string, name = id): Command {
  return { id, name, execute: () => {} };
}

describe("CommandRegistry", () => {
  test("register and get", () => {
    const registry = new CommandRegistry();
    const cmd = makeCommand("a");
    registry.register(cmd);
    expect(registry.get("a")).toBe(cmd);
  });

  test("get returns undefined for unknown id", () => {
    const registry = new CommandRegistry();
    expect(registry.get("nope")).toBeUndefined();
  });

  test("getAll returns empty array initially", () => {
    const registry = new CommandRegistry();
    expect(registry.getAll()).toEqual([]);
  });

  test("getAll preserves registration order", () => {
    const registry = new CommandRegistry();
    const a = makeCommand("a");
    const b = makeCommand("b");
    const c = makeCommand("c");
    registry.register(c);
    registry.register(a);
    registry.register(b);
    expect(registry.getAll()).toEqual([c, a, b]);
  });

  test("throws on duplicate id", () => {
    const registry = new CommandRegistry();
    registry.register(makeCommand("a"));
    expect(() => registry.register(makeCommand("a"))).toThrow('Command "a" is already registered');
  });

  test("unregister removes command", () => {
    const registry = new CommandRegistry();
    registry.register(makeCommand("a"));
    registry.unregister("a");
    expect(registry.get("a")).toBeUndefined();
    expect(registry.getAll()).toEqual([]);
  });

  test("unregister non-existent id is no-op", () => {
    const registry = new CommandRegistry();
    registry.unregister("ghost");
    expect(registry.getAll()).toEqual([]);
  });

  test("register after unregister same id succeeds", () => {
    const registry = new CommandRegistry();
    const first = makeCommand("a");
    const second = makeCommand("a");
    registry.register(first);
    registry.unregister("a");
    registry.register(second);
    expect(registry.get("a")).toBe(second);
  });
});
