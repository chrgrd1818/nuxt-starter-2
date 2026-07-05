import type { H3Event } from "h3";
import type { User } from "@supabase/supabase-js";

export function requireUser(event: H3Event): User {
  const user = event.context.user;

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Authentication required",
    });
  }

  return user;
}
