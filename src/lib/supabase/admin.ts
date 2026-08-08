import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for trusted server-side work only (Storage uploads,
 * cleanup of orphaned files). Never import this from client components —
 * the `server-only` guard above will fail the build if you try.
 */
export function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
