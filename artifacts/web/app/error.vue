<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
  error: NuxtError;
}>();

function handleClear(): void {
  clearError({ redirect: "/" });
}
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
    <p class="text-sm font-medium text-muted">
      {{ error.statusCode }}
    </p>
    <h1 class="text-2xl font-semibold">
      {{ error.statusMessage || "Something went wrong" }}
    </h1>
    <UButton label="Go back home" @click="handleClear" />
  </div>
</template>
