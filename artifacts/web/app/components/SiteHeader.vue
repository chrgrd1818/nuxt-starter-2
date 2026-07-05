<script setup lang="ts">
import type { AppUser } from "../types";
import { getTexts } from "../utils/locales/texts";

const config = useRuntimeConfig();
const texts = getTexts(config.public.lang);
const appConfig = useAppConfig();

const { data, refresh } = await useFetch<{ user: AppUser | null }>("/auth/me");

const isSignedIn = computed(() => Boolean(data.value?.user));

async function handleSignOut(): Promise<void> {
  await $fetch("/auth/sign-out", { method: "POST" });
  await refresh();
  await navigateTo("/auth/sign-in");
}
</script>

<template>
  <header class="flex items-center justify-between border-b border-default px-6 py-4">
    <NuxtLink to="/" class="font-display text-base font-semibold text-primary">
      {{ appConfig.appName }}
    </NuxtLink>

    <nav class="flex items-center gap-3">
      <template v-if="isSignedIn">
        <UButton variant="ghost" :label="texts.nav.profile" to="/profile" />
        <UButton variant="ghost" :label="texts.nav.signOut" @click="handleSignOut" />
      </template>
      <template v-else>
        <UButton variant="ghost" :label="texts.nav.signIn" to="/auth/sign-in" />
        <UButton :label="texts.nav.signUp" to="/auth/sign-up" />
      </template>
    </nav>
  </header>
</template>
