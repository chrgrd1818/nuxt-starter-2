---
name: Nuxt shared auth/session state across components
description: Why independent useFetch("/auth/me") calls in layout components (header) go stale after login/logout, and the fix.
---

Persistent layout components (e.g. a site header) only run their `setup()` once per app load — they don't re-run `useFetch` on client-side route navigation. A page component that unmounts/remounts (e.g. navigating to `/`) will refetch, but the header won't, so the header shows stale signed-in/out state until a full page refresh.

**Why:** `useFetch` executes on component setup, not on every navigation. Two independent `useFetch(url)` calls with no explicit `key` happen to dedupe to the same cache key, but that doesn't mean they re-run together — only an explicit refresh does.

**How to apply:** Create one shared composable (e.g. `useAuthUser()`) wrapping `useFetch(url, { key: "auth-me" })`, used by every component that needs the session (header, home, profile, etc.). After any auth-mutating action (sign-in, sign-up-confirm, sign-out), call `refreshNuxtData("auth-me")` before navigating — this updates all consumers of that key at once, without needing a full page reload.
