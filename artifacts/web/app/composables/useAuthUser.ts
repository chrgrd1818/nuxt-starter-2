import type { AppUser } from "../types";

const AUTH_ME_KEY = "auth-me";

export function useAuthUser() {
  return useFetch<{ user: AppUser | null }>("/auth/me", { key: AUTH_ME_KEY });
}

export async function refreshAuthUser(): Promise<void> {
  await refreshNuxtData(AUTH_ME_KEY);
}
