## Goal
Add a parallel **Netlify-only** build path alongside the existing Lovable/Cloudflare and Vercel setups. The current `vite.config.ts` (Lovable/Cloudflare) and `vite.config.vercel.ts` (Vercel) stay untouched and keep working exactly as today.

## Approach
Same pattern as the Vercel setup — a sibling Vite config that flips the Nitro preset, plus a `netlify.toml` so Netlify knows what to run. No changes to app code, no changes to existing configs' default behavior.

### Files added

1. **`vite.config.netlify.ts`** (new)
   - Wraps the same `@lovable.dev/vite-tanstack-config` setup
   - Sets `nitro.preset = "netlify"` (Netlify Functions, Node serverless)
   - Keeps `imagetools` and all other plugins identical to the default config
   - Output lands in `.netlify/functions-internal/` + `dist/` in the format Netlify auto-detects

2. **`netlify.toml`** (new)
   - `command = "bun run build:netlify"`
   - `publish = "dist"` (static client assets)
   - Node version pin (Node 20)
   - No manual redirects needed — the Nitro `netlify` preset emits the SSR function + routing rules automatically, which fixes the 404-on-refresh problem you saw on Vercel-style setups

3. **`package.json` scripts** (additive only)
   - `"build:netlify": "vite build --config vite.config.netlify.ts"`
   - Existing `dev`, `build`, and `build:vercel` scripts remain untouched

### What does NOT change
- `src/` application code — zero edits
- `vite.config.ts` — untouched (Lovable/Cloudflare)
- `vite.config.vercel.ts` — untouched
- `vercel.json` — untouched
- Server functions, Supabase integration, routing — all isomorphic, work on Netlify too

### How it works after setup
- **Lovable Publish** → `vite build` → Cloudflare Workers (unchanged)
- **Vercel** → `bun run build:vercel` → Node serverless (unchanged)
- **Netlify** (connected to your GitHub repo) → `bun run build:netlify` → Netlify Functions

### Env vars to set in Netlify (same list as Vercel)
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID`
- `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `LOVABLE_API_KEY` (if AI Gateway is used)
- `ADMIN_PASSWORD` and any other secrets currently in Lovable Cloud

### Risks / things to know
- You'll now maintain three sets of env vars (Lovable Cloud, Vercel, Netlify). They must stay in sync.
- Custom domain can only point at one host at a time; `kwarakre8ives.com` stays on Lovable unless you move it.
- If the Lovable template's Nitro plugin shape changes in a future update, the netlify config may need a small tweak (same risk as the Vercel one).

### Files touched
- **New:** `vite.config.netlify.ts`, `netlify.toml`
- **Edited (additive only):** `package.json` (one new script)

After implementation I'll give you the Netlify connect steps and the exact env-var list to paste in.