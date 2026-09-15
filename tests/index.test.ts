import { expect, it } from "vite-plus/test";
import * as CmdoraPublicApi from "../src/index.ts";

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
