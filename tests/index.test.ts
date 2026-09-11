import { expect, test } from "vite-plus/test";
import * as CmdoraPublicApi from "../src/index.ts";
import type { Command } from "../src/index.ts";

test("Command can be created and executed", async () => {
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

test("public API only exposes CmdoraProvider and useCommandPalette", () => {
  expect(Object.keys(CmdoraPublicApi).sort()).toEqual(["CmdoraProvider", "useCommandPalette"]);
});

test("useCmdora, useCommandState, and the internal stores are not public exports", () => {
  expect("useCmdora" in CmdoraPublicApi).toBe(false);
  expect("useCommandState" in CmdoraPublicApi).toBe(false);
  expect("CommandRegistry" in CmdoraPublicApi).toBe(false);
  expect("CommandStateStore" in CmdoraPublicApi).toBe(false);
});
