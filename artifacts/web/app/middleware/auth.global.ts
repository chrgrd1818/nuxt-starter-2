import type { AppUser } from "../types";

const PUBLIC_ROUTES = new Set(["/", "/auth/sign-in", "/auth/sign-up"]);

export default defineNuxtRouteMiddleware(async (to) => {
  // Confirm route: allow unauthenticated, but redirect authenticated users
  if (to.path === "/auth/confirm") {
    const { data } = await useFetch<{ user: AppUser | null }>("/auth/me");
    if (data.value?.user) {
      return navigateTo("/profile");
    }
    return;
  }

  // Public routes: no auth check needed
  if (PUBLIC_ROUTES.has(to.path)) {
    return;
  }

  // Protected routes: require authentication
  const { data } = await useFetch<{ user: AppUser | null }>("/auth/me");

  if (!data.value?.user) {
    return navigateTo("/auth/sign-in");
  }
});
