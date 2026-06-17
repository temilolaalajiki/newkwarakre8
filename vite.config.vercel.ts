// Vercel-only Vite config. The default `vite.config.ts` keeps building for
// Lovable Cloud / Cloudflare Workers; this file is used ONLY when building
// for Vercel (via `bun run build:vercel`, which is wired into vercel.json).
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { imagetools } from "vite-imagetools";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    plugins: [imagetools()],
  },
  // Force Nitro on and target Vercel's Node serverless runtime.
  // Output goes to .vercel/output/ (Vercel Build Output API v3),
  // which Vercel auto-detects with no extra config.
  nitro: {
    preset: "vercel",
  },
});
