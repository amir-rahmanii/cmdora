import { defineConfig } from "vite-plus";
import { defineOxlintConfig } from "@fullstacksjs/oxlint-config";

export default defineConfig({
  lint: {
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
  },
});
