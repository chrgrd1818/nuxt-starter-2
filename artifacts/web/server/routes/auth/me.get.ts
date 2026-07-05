import type { AppUser } from "../../../app/types";

export default defineEventHandler((event): { user: AppUser | null } => {
  const user = event.context.user;

  if (!user || !user.email) {
    return { user: null };
  }

  const appUser: AppUser = {
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
    displayName: (user.user_metadata?.display_name as string | undefined) ?? null,
  };

  return { user: appUser };
});
