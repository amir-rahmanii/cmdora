import { defineConfig } from "vite-plus";
import { defineOxlintConfig } from "@fullstacksjs/oxlint-config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
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
