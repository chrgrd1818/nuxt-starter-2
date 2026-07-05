<script setup lang="ts">
import type { AppUser } from "../types";
import { getTexts } from "../utils/locales/texts";

const config = useRuntimeConfig();
const texts = getTexts(config.public.lang);

const { data } = await useFetch<{ user: AppUser | null }>("/auth/me");

const heading = computed(() =>
  data.value?.user ? texts.home.welcomeBack : texts.home.welcomeGuest,
);
</script>

<template>
  <div class="mx-auto max-w-2xl px-6 py-16 text-center">
    <h1 class="text-3xl font-semibold">{{ heading }}</h1>
    <p v-if="data?.user" class="mt-2 text-muted">
      {{ texts.home.signedInAs }} {{ data.user.email }}
    </p>
  </div>
</template>
