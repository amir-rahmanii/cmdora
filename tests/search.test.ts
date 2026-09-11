import { expect, test } from "vite-plus/test";
import { filterCommands } from "../src/search.ts";
import type { Command } from "../src/index.ts";

function makeCommand(id: string, name: string): Command {
  return { id, name, execute: () => {} };
}

const commands: Command[] = [
  makeCommand("a", "Say hello"),
  makeCommand("b", "Increment counter"),
  makeCommand("c", "Toggle dark mode"),
];

test("empty query returns all commands", () => {
  expect(filterCommands(commands, "")).toEqual(commands);
});

test("whitespace-only query returns all commands", () => {
  expect(filterCommands(commands, "   ")).toEqual(commands);
});

test("matches by command name", () => {
  expect(filterCommands(commands, "hello")).toEqual([commands[0]]);
});

test("search is case-insensitive", () => {
  expect(filterCommands(commands, "HELLO")).toEqual([commands[0]]);
  expect(filterCommands(commands, "ToGgLe")).toEqual([commands[2]]);
});

test("search trims surrounding whitespace", () => {
  expect(filterCommands(commands, "  hello  ")).toEqual([commands[0]]);
});

test("unmatched query returns no commands", () => {
  expect(filterCommands(commands, "nonexistent")).toEqual([]);
});

test("preserves original command order for multiple matches", () => {
  const ordered: Command[] = [
    makeCommand("x", "Xylophone"),
    makeCommand("y", "Copy file"),
    makeCommand("z", "Color picker"),
  ];

  expect(filterCommands(ordered, "co")).toEqual([ordered[1], ordered[2]]);
});
