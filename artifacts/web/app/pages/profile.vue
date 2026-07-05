<script setup lang="ts">
import type { AppUser } from "../types";
import { getTexts } from "../utils/locales/texts";
import { useSupabaseClient } from "../utils/supabase-client";

const config = useRuntimeConfig();
const texts = getTexts(config.public.lang);

const { data } = await useFetch<{ user: AppUser | null }>("/auth/me");

const newPassword = ref("");
const isSubmitting = ref(false);
const successMessage = ref<string | null>(null);
const errorMessage = ref<string | null>(null);

const memberSince = computed(() => {
  if (!data.value?.user) {
    return "";
  }

  return new Date(data.value.user.createdAt).toLocaleDateString();
});

async function handleUpdatePassword(): Promise<void> {
  successMessage.value = null;
  errorMessage.value = null;
  isSubmitting.value = true;

  const supabase = useSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword.value });

  if (error) {
    errorMessage.value = error.message;
  } else {
    successMessage.value = texts.profile.passwordUpdated;
    newPassword.value = "";
  }

  isSubmitting.value = false;
}
</script>

<template>
  <div class="mx-auto max-w-xl px-6 py-16">
    <h1 class="font-display text-2xl font-semibold">{{ texts.profile.title }}</h1>

    <div v-if="data?.user" class="mt-8 space-y-8">
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="text-sm text-muted">{{ texts.profile.email }}</p>
          <p class="text-base">{{ data.user.email }}</p>
        </div>

        <div>
          <p class="text-sm text-muted">{{ texts.profile.memberSince }}</p>
          <p class="text-base">{{ memberSince }}</p>
        </div>
      </div>

      <form class="flex flex-col gap-4" @submit.prevent="handleUpdatePassword">
        <UFormField :label="texts.profile.newPassword">
          <UInput v-model="newPassword" type="password" required class="w-full" />
        </UFormField>

        <p v-if="errorMessage" class="text-sm text-error">{{ errorMessage }}</p>
        <p v-if="successMessage" class="text-sm text-success">{{ successMessage }}</p>

        <UButton
          type="submit"
          :loading="isSubmitting"
          :label="texts.profile.updatePassword"
          class="self-start"
        />
      </form>
    </div>
  </div>
</template>
