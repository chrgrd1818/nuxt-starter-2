<script setup lang="ts">
import { getTexts } from "../../utils/locales/texts";
import { useSupabaseClient } from "../../utils/supabase-client";

const config = useRuntimeConfig();
const texts = getTexts(config.public.lang);
const route = useRoute();

const status = ref<"pending" | "success" | "error">("pending");

onMounted(async () => {
  const tokenHash = route.query.token_hash;
  const type = route.query.type;

  if (typeof tokenHash !== "string" || typeof type !== "string") {
    status.value = "error";
    return;
  }

  const supabase = useSupabaseClient();

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type: type as "email" | "signup" | "recovery" | "invite" | "email_change",
  });

  status.value = error ? "error" : "success";

  if (!error) {
    await refreshAuthUser();
    await navigateTo("/profile");
  }
});
</script>

<template>
  <div class="mx-auto flex min-h-[70vh] max-w-sm flex-col items-center justify-center gap-3 px-6 text-center">
    <h1 class="text-xl font-semibold">{{ texts.auth.confirmTitle }}</h1>
    <p v-if="status === 'success'" class="text-sm text-muted">{{ texts.auth.confirmSuccess }}</p>
    <p v-else-if="status === 'error'" class="text-sm text-error">{{ texts.auth.confirmError }}</p>
    <UButton v-if="status !== 'pending'" :label="texts.nav.signIn" to="/auth/sign-in" />
  </div>
</template>
