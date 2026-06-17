// Netlify-only Vite config. The default `vite.config.ts` keeps building for
// Lovable Cloud / Cloudflare Workers; this file is used ONLY when building
// for Netlify (via `bun run build:netlify`, which is wired into netlify.toml).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [imagetools()],
  },
  // Force Nitro on and target Netlify Functions (Node serverless).
  // The Nitro `netlify` preset emits the SSR function plus the routing
  // rules Netlify needs, so deep links and refreshes don't 404.
  nitro: {
    preset: "netlify",
  },
});
