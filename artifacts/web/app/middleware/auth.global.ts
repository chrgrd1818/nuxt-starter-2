import type { AppUser } from "../types";

const PUBLIC_ROUTES = new Set(["/", "/auth/sign-in", "/auth/sign-up", "/auth/confirm"]);

export default defineNuxtRouteMiddleware(async (to) => {
  if (PUBLIC_ROUTES.has(to.path)) {
    return;
  }

  const { data } = await useFetch<{ user: AppUser | null }>("/auth/me");

  if (!data.value?.user) {
    return navigateTo("/auth/sign-in");
  }
});
