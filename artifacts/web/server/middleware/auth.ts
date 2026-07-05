import type { User } from "@supabase/supabase-js";
import { getSupabaseServerClient } from "../utils/supabase";

declare module "h3" {
  interface H3EventContext {
    user: User | null;
  }
}

export default defineEventHandler(async (event) => {
  const supabase = getSupabaseServerClient(event);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  event.context.user = user;
});
