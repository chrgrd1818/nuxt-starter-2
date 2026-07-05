<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { getTexts } from "../utils/locales/texts";

const config = useRuntimeConfig();
const texts = getTexts(config.public.lang);
const appConfig = useAppConfig();

const { data } = await useAuthUser();

const isSignedIn = computed(() => Boolean(data.value?.user));
const isMobileMenuOpen = ref(false);

function closeMobileMenu(): void {
  isMobileMenuOpen.value = false;
}

function openMobileMenu(): void {
  isMobileMenuOpen.value = true;
}

async function handleSignOut(): Promise<void> {
  isMobileMenuOpen.value = false;
  await $fetch("/auth/sign-out", { method: "POST" });
  await refreshAuthUser();
  await navigateTo("/auth/sign-in");
}

const navItems = computed<NavigationMenuItem[]>(() => {
  const items: NavigationMenuItem[] = [{ label: texts.nav.home, to: "/", icon: "i-lucide-house" }];

  if (isSignedIn.value) {
    items.push({ label: texts.nav.profile, to: "/profile", icon: "i-lucide-user" });
  }

  return items;
});
</script>

<template>
  <header class="flex items-center justify-between border-b border-default px-6 py-4">
    <NuxtLink to="/" class="font-display text-base font-semibold text-primary">
      {{ appConfig.appName }}
    </NuxtLink>

    <UNavigationMenu :items="navItems" class="hidden sm:flex" />

    <div class="hidden items-center gap-3 sm:flex">
      <span v-if="data?.user?.displayName" class="text-sm text-muted">
        {{ data.user.displayName }}
      </span>
      <UButton v-if="isSignedIn" variant="ghost" :label="texts.nav.signOut" @click="handleSignOut" />
      <UButton v-else variant="ghost" :label="texts.nav.signIn" to="/auth/sign-in" />
    </div>

    <UButton
      icon="i-lucide-menu"
      variant="ghost"
      color="neutral"
      class="sm:hidden"
      :aria-label="texts.nav.openMenu"
      @click="openMobileMenu"
    />

    <USlideover v-model:open="isMobileMenuOpen" side="right" :title="appConfig.appName">
      <template #body>
        <div class="flex flex-col gap-6">
          <UNavigationMenu :items="navItems" orientation="vertical" @click="closeMobileMenu" />

          <div class="flex flex-col gap-3 border-t border-default pt-4">
            <span v-if="data?.user?.displayName" class="text-sm text-muted">
              {{ data.user.displayName }}
            </span>
            <UButton
              v-if="isSignedIn"
              variant="soft"
              block
              :label="texts.nav.signOut"
              @click="handleSignOut"
            />
            <UButton
              v-else
              block
              :label="texts.nav.signIn"
              to="/auth/sign-in"
              @click="closeMobileMenu"
            />
          </div>
        </div>
      </template>
    </USlideover>
  </header>
</template>
