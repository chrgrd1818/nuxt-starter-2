import { getSupabaseServerClient } from "../../utils/supabase";

export default defineEventHandler(async (event): Promise<{ success: true }> => {
  const supabase = getSupabaseServerClient(event);

  await supabase.auth.signOut();

  return { success: true };
});
