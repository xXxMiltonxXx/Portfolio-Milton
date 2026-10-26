// @ts-check
import { defineConfig, envField } from "astro/config";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://portfolio-milton-rho.vercel.app",
  output: "static",
  adapter: vercel(),
  env: {
    schema: {
      ANTHROPIC_API_KEY: envField.string({ context: "server", access: "secret", optional: true }),
      ANTHROPIC_MODEL: envField.string({ context: "server", access: "secret", optional: true }),
    },
  },
});
