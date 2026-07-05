import { createServerClient, parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { H3Event } from "h3";

export function getSupabaseServerClient(event: H3Event): SupabaseClient {
  const config = useRuntimeConfig(event);

  return createServerClient(config.public.supabaseUrl, config.public.supabaseKey, {
    cookies: {
      getAll() {
        const cookieHeader = getRequestHeader(event, "cookie") ?? "";
        return parseCookieHeader(cookieHeader).map((cookie) => ({
          name: cookie.name,
          value: cookie.value ?? "",
        }));
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          appendResponseHeader(
            event,
            "set-cookie",
            serializeCookieHeader(name, value, options),
          );
        }
      },
    },
  });
}

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(event: H3Event): SupabaseClient {
  if (adminClient) {
    return adminClient;
  }

  const config = useRuntimeConfig(event);

  adminClient = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  return adminClient;
}
