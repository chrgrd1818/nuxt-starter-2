import type { AuthCredentials, AuthResponse } from "../../../app/types";
import { getSupabaseServerClient } from "../../utils/supabase";

export default defineEventHandler(async (event): Promise<AuthResponse> => {
  const body = await readBody<AuthCredentials>(event);

  if (!body?.email || !body?.password) {
    throw createError({
      statusCode: 400,
      statusMessage: "Email and password are required",
    });
  }

  const supabase = getSupabaseServerClient(event);

  const { data, error } = await supabase.auth.signUp({
    email: body.email,
    password: body.password,
  });

  if (error || !data.user || !data.user.email) {
    throw createError({
      statusCode: 400,
      statusMessage: error?.message || "Could not create account",
    });
  }

  return {
    user: {
      id: data.user.id,
      email: data.user.email,
      createdAt: data.user.created_at,
    },
  };
});
