import { expect, it } from "vite-plus/test";
import { filterCommands } from "../src/command-palette/search.ts";
import type { Command } from "../src/index.ts";

function makeCommand(id: string, name: string): Command {
  return { id, name, execute: () => {} };
}

const commands: Command[] = [
  makeCommand("a", "Say hello"),
  makeCommand("b", "Increment counter"),
  makeCommand("c", "Toggle dark mode"),
];

it("empty query returns all commands", () => {
  expect(filterCommands(commands, "")).toEqual(commands);
});

it("whitespace-only query returns all commands", () => {
  expect(filterCommands(commands, "   ")).toEqual(commands);
});

it("matches by command name", () => {
  expect(filterCommands(commands, "hello")).toEqual([commands[0]]);
});

it("search is case-insensitive", () => {
  expect(filterCommands(commands, "HELLO")).toEqual([commands[0]]);
  expect(filterCommands(commands, "ToGgLe")).toEqual([commands[2]]);
});

it("search trims surrounding whitespace", () => {
  expect(filterCommands(commands, "  hello  ")).toEqual([commands[0]]);
});

it("unmatched query returns no commands", () => {
  expect(filterCommands(commands, "nonexistent")).toEqual([]);
});

it("preserves original command order for multiple matches", () => {
  const ordered: Command[] = [
    makeCommand("x", "Xylophone"),
    makeCommand("y", "Copy file"),
    makeCommand("z", "Color picker"),
  ];

  expect(filterCommands(ordered, "co")).toEqual([ordered[1], ordered[2]]);
});
