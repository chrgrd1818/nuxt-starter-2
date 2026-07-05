# Nuxt Starter

A Nuxt 4 SSR web app with Supabase-backed authentication (email/password sign-up, sign-in, sign-out, email confirmation) and a shared Express API server for other backend needs.

## Run & Operate

- `pnpm --filter @workspace/web run dev` — run the Nuxt app (dev server, port from `PORT` env)
- `pnpm --filter @workspace/api-server run dev` — run the shared API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages (includes `nuxt typecheck` for the web app)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec (for the shared API server, not used by the Nuxt app's own server routes)
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` (Postgres, for the shared API server), `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Supabase project, user-provided)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9 (strict, no `any`)
- Web app: Nuxt 4 (SSR), Vue 3, @nuxt/ui v4, Tailwind CSS v4
- Auth/DB: Supabase (`@supabase/ssr`, `@supabase/supabase-js`) — user's own Supabase project, not Replit's built-in DB/Auth
- Shared API: Express 5 + PostgreSQL + Drizzle ORM (separate artifact, used for non-auth backend needs)
- API codegen: Orval (from OpenAPI spec, for the Express API only)

## Where things live

- `artifacts/web/` — the Nuxt app
  - `app/pages/`, `app/layouts/`, `app/components/` — presentational views
  - `app/middleware/auth.global.ts` — client-side route guard (redirects unauthenticated users to `/auth/sign-in`)
  - `app/utils/supabase-client.ts` — browser Supabase client
  - `app/utils/locales/` — hand-rolled i18n (`en.json`, `fr.json`, `texts.ts`) — no `@nuxtjs/i18n` per user preference
  - `server/routes/auth/*` — Supabase auth endpoints (sign-in, sign-up, sign-out, me) — server API/state logic layer
  - `server/utils/supabase.ts` — server-side Supabase client (SSR cookie-aware) + admin client (service role key)
  - `server/middleware/auth.ts` — attaches `event.context.user` from Supabase session on every request
- `artifacts/api-server/` — shared Express API server (separate artifact, mounted at `/api`)

## Architecture decisions

- The Nuxt app's own server routes live under `server/routes/*` (NOT `server/api/*`) because the `/api` path prefix is already owned by the separate `api-server` artifact in this workspace. Auth endpoints are reachable at `/auth/*`, not `/api/auth/*`.
- No `@nuxtjs/supabase` module — Supabase clients are hand-wired (browser client + SSR-cookie-aware server client + admin client) for full control over the 3-layer separation.
- No `@nuxtjs/i18n` — a lightweight custom `getTexts(locale)` utility reads from `NUXT_PUBLIC_LANG` instead.
- `SUPABASE_SERVICE_ROLE_KEY` is only exposed via the private (non-`public`) side of `runtimeConfig`, never sent to the client.
- Nuxt was bootstrapped via the `react-vite` artifact type (Nuxt isn't a native artifact type), then the scaffold was replaced with the full Nuxt structure and `artifact.toml` was rewritten for SSR (build → `nuxt build`, run → `node .output/server/index.mjs`).

## Product

- Users can sign up, sign in, sign out, and confirm their email via Supabase auth.
- Unauthenticated users are redirected to sign-in for any non-auth route.
- Home page shows a personalized welcome message when signed in.

## User preferences

- User provides their own Supabase project keys rather than using Replit's built-in DB/Auth.
- No `@nuxtjs/supabase` or `@nuxtjs/i18n` modules — build custom equivalents instead.
- Strict TypeScript throughout; no `any`.

## Gotchas

- Nuxt's telemetry prompt blocks dev server startup in this environment if not disabled — `NUXT_TELEMETRY_DISABLED=1` is set in the artifact's service env.
- `nuxt.config.ts` must not throw if `PORT` is unset (falls back to 3000), since `nuxt prepare` runs during `pnpm install`/postinstall before any workflow env is present.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
