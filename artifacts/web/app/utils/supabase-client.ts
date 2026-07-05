import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

export function useSupabaseClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const config = useRuntimeConfig();

  browserClient = createBrowserClient(
    config.public.supabaseUrl,
    config.public.supabaseKey,
  );

  return browserClient;
}
