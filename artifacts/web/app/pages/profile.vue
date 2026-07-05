<script setup lang="ts">
import { getTexts } from "../utils/locales/texts";

const config = useRuntimeConfig();
const texts = getTexts(config.public.lang);

const { data } = await useAuthUser();

const memberSince = computed(() => {
  if (!data.value?.user) {
    return "";
  }

  return new Date(data.value.user.createdAt).toLocaleDateString();
});
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-16">
    <h1 class="font-display text-2xl font-semibold">{{ texts.profile.title }}</h1>

    <div v-if="data?.user" class="mt-8 grid gap-6 sm:grid-cols-2">
      <div v-if="data.user.displayName">
        <p class="text-sm text-muted">{{ texts.profile.displayName }}</p>
        <p class="text-base">{{ data.user.displayName }}</p>
      </div>

      <div>
        <p class="text-sm text-muted">{{ texts.profile.email }}</p>
        <p class="text-base">{{ data.user.email }}</p>
      </div>

      <div>
        <p class="text-sm text-muted">{{ texts.profile.memberSince }}</p>
        <p class="text-base">{{ memberSince }}</p>
      </div>
    </div>
  </div>
</template>
