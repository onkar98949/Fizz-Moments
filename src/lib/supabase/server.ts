import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/** Per-request Supabase client for Server Components, Server Actions, and
 *  Route Handlers. Reads the session from cookies; writes are silently
 *  skipped when called from a Server Component (cookies are read-only
 *  there) — middleware is the one place session refresh actually persists. */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component render — middleware handles the refresh instead.
          }
        },
      },
    },
  );
}

/** Convenience for the common "attach the current user if there is one"
 *  case — content creation stays anonymous-friendly, so callers treat a
 *  null return as "guest," not an error. */
export async function getCurrentUserId(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}
