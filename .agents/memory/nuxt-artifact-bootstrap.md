---
name: Bootstrapping Nuxt as a Replit artifact
description: How to get a Nuxt 4 SSR app running as a Replit artifact when Nuxt isn't a supported createArtifact type.
---

`createArtifact` does not support a `"nuxt"` artifactType (only expo, data-visualization, mockup-sandbox, react-vite, slides, video-js). To get a valid artifact.toml/id/port allocated, bootstrap with `artifactType: "react-vite"`, then delete the scaffolded React files and replace with the real Nuxt file tree.

**Why:** there is no other supported path to register a non-listed framework as an artifact; the react-vite scaffold is the closest shape (single web service, one port) to adapt.

**How to apply:**
- After bootstrapping, rewrite `.replit-artifact/artifact.toml` via `verifyAndReplaceArtifactToml` (never edit in place). Nuxt is SSR, not static, so mirror the `api-server` artifact's production pattern (`services.production.build`/`services.production.run` with explicit `args`, not `serve = "static"`), pointing `run` at `node <slug>/.output/server/index.mjs` after `nuxt build`.
- `nuxt.config.ts` must NOT throw if `PORT` is unset — `nuxt prepare` (wired as `postinstall`) runs during `pnpm install`, before any workflow injects `PORT`. Fall back to a default port instead of throwing, or `pnpm install` fails.
- Nuxt's telemetry consent prompt is interactive and will hang the dev server on first boot in this environment. Set `NUXT_TELEMETRY_DISABLED=1` in the artifact's `[services.env]` block (applies to both dev and prod) to suppress it non-interactively.
- If another artifact already owns the `/api` path prefix (e.g. a separate Express `api-server`), Nuxt's own `server/api/*` routes (which Nitro auto-prefixes with `/api`) will never be reached — the shared proxy routes `/api/*` to the other service first. Put Nuxt's own server endpoints under `server/routes/*` instead (unprefixed, e.g. `/auth/sign-in`) to avoid the collision.
- `@supabase/ssr`'s `createServerClient`/`createBrowserClient` only re-export cookie helpers; `SupabaseClient` and the plain `createClient` (for an admin/service-role client) come from `@supabase/supabase-js`, not `@supabase/ssr`.
