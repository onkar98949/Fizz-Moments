import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Google redirects here (via Supabase) with a `code` to exchange for a
 *  session. This is the one step in the flow that has to be a Route
 *  Handler rather than a Server Action — it's Google/Supabase redirecting
 *  the browser with a GET request, not a form submission. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=${encodeURIComponent("Sign-in didn't work. Please try again.")}`,
  );
}
