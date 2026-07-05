<script setup lang="ts">
import type { AuthCredentials, AuthResponse, ApiErrorPayload } from "../../types";
import { getTexts } from "../../utils/locales/texts";

const config = useRuntimeConfig();
const texts = getTexts(config.public.lang);

const email = ref("");
const password = ref("");
const errorMessage = ref<string | null>(null);
const isSubmitting = ref(false);

async function handleSubmit(): Promise<void> {
  errorMessage.value = null;
  isSubmitting.value = true;

  const credentials: AuthCredentials = {
    email: email.value,
    password: password.value,
  };

  try {
    await $fetch<AuthResponse>("/auth/sign-in", {
      method: "POST",
      body: credentials,
    });
    await navigateTo("/");
  } catch (err) {
    const fetchError = err as { data?: ApiErrorPayload; statusMessage?: string };
    errorMessage.value = fetchError.data?.error || fetchError.statusMessage || "Sign in failed";
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <div class="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6">
    <h1 class="mb-6 text-xl font-semibold">{{ texts.auth.signInTitle }}</h1>

    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UFormField :label="texts.auth.email">
        <UInput v-model="email" type="email" required class="w-full" />
      </UFormField>

      <UFormField :label="texts.auth.password">
        <UInput v-model="password" type="password" required class="w-full" />
      </UFormField>

      <p v-if="errorMessage" class="text-sm text-error">{{ errorMessage }}</p>

      <UButton type="submit" block :loading="isSubmitting" :label="texts.auth.signInAction" />
    </form>

    <p class="mt-4 text-sm text-muted">
      {{ texts.auth.noAccount }}
      <NuxtLink to="/auth/sign-up" class="text-primary">{{ texts.nav.signUp }}</NuxtLink>
    </p>
  </div>
</template>
