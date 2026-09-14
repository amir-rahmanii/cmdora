import { defineConfig } from "vite-plus";
import { defineOxlintConfig } from "@fullstacksjs/oxlint-config";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  test: {
    environment: "jsdom",
  },
  pack: {
    exports: true,
  },
  lint: {
    // Declaration files crash the react/refs JS plugin (issue upstream in oxlint).
    ignorePatterns: ["**/*.d.ts"],
    extends: [
      defineOxlintConfig({
        modules: {
          nodejs: true,
          react: true,
          nextjs: true,
          vitest: true,
          jest: false,
        },
        options: {
          strict: true,
          typeAware: true,
          esm: true,
        },
      }),
    ],
    overrides: [
      {
        // CommandPalette renders a div[role="dialog"] inside a portal with its own
        // backdrop/focus-trap/click-outside handling; native <dialog> owns incompatible
        // top-layer and ::backdrop semantics, so the ARIA role pattern is intentional.
        files: ["src/command-palette/command-palette.tsx"],
        rules: {
          "jsx-a11y/prefer-tag-over-role": "off",
        },
      },
      {
        // Autofocusing the search field is the expected UX for a Ctrl+K command
        // palette: the dialog only opens in direct response to a user action.
        files: ["example/src/App.tsx", "tests/command-input.test.tsx"],
        rules: {
          "jsx-a11y/no-autofocus": "off",
        },
      },
    ],
  },
  fmt: {},
});
