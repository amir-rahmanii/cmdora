import { expect, it } from "vite-plus/test";
import * as CmdoraPublicApi from "../src/index.ts";
import type { Command } from "../src/index.ts";

it("Command can be created and executed", async () => {
  let executed = false;

  const command: Command = {
    id: "test-command",
    name: "Test Command",
    execute: () => {
      executed = true;
    },
  };

  await command.execute();

  expect(command.id).toBe("test-command");
  expect(command.name).toBe("Test Command");
  expect(executed).toBe(true);
});

it("public API exposes only the intended runtime exports", () => {
  expect(Object.keys(CmdoraPublicApi).sort()).toEqual([
    "CmdoraProvider",
    "CommandEmpty",
    "CommandInput",
    "CommandList",
    "CommandPalette",
    "useCommandPalette",
  ]);
});
