import type { AuthCredentials, AuthResponse } from "../../../app/types";
import { getSupabaseServerClient } from "../../utils/supabase";

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const body = await readBody<AuthCredentials>(event);

  if (!body?.email || !body?.password) {
    setResponseStatus(event, 400);
    return { error: "Email and password are required" };
  }

  const supabase = getSupabaseServerClient(event);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: body.email,
    password: body.password,
  });

  if (error || !data.user || !data.user.email) {
    setResponseStatus(event, 401);
    return { error: error?.message || "Invalid credentials" };
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      createdAt: data.user.created_at,
      displayName: (data.user.user_metadata?.display_name as string | undefined) ?? null,
    },
  };
});
