import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NavbarClient } from "./navbar-client";
import type { AuthUser } from "@/features/auth/types";

/** Fetches the current session server-side so the navbar renders correctly
 *  authenticated on first paint — no logged-out flash while a client
 *  listener catches up. All the interactive chrome lives in NavbarClient;
 *  this wrapper's only job is knowing who's signed in. */
export async function Navbar() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: supabaseUser },
  } = await supabase.auth.getUser();

  const user: AuthUser | null = supabaseUser
    ? {
        name:
          (supabaseUser.user_metadata?.full_name as string | undefined) ??
          (supabaseUser.user_metadata?.name as string | undefined) ??
          supabaseUser.email ??
          "Account",
        email: supabaseUser.email ?? "",
        avatarUrl: (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? null,
      }
    : null;

  return <NavbarClient user={user} />;
}
