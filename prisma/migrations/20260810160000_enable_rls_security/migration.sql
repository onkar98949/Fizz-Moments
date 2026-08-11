-- ============================================================================
-- Enable Row Level Security across all public-schema tables.
--
-- Context: Supabase Security Advisor reports ~19 "RLS Disabled in Public"
-- errors. Verified live (read-only) before writing this migration:
--   - Every public table currently has rowsecurity = false and zero
--     policies, while still carrying Supabase's default GRANT of
--     SELECT/INSERT/UPDATE/DELETE/TRUNCATE/REFERENCES/TRIGGER to both
--     `anon` and `authenticated`. That means every row of every table is
--     currently readable and writable by anyone holding the public anon
--     key, via Supabase's REST API, completely bypassing this app's own
--     editToken-based authorization.
--   - This application never queries these tables through the Supabase
--     REST/GraphQL API (`supabase-js` `.from()` is not called anywhere
--     against a Postgres table in this codebase — only `.storage.from()`
--     for photo uploads and `.auth.*` for sessions). All data access goes
--     through Prisma.
--   - Prisma's own connection (both DATABASE_URL and DIRECT_URL, i.e. both
--     the app at runtime and `prisma migrate deploy` itself) authenticates
--     as the `postgres` role, confirmed live via
--     `SELECT rolname, rolbypassrls FROM pg_roles` to have
--     rolbypassrls = true. RLS never applies to it, with or without
--     policies. `service_role` also has rolbypassrls = true.
--
-- This app's authorization model is capability-URL based (editToken to
-- edit, public id to view/react/redeem), not Supabase session-based —
-- most rows have user_id = NULL, and even "claimed" rows are still meant
-- to be reachable by anyone holding the link. There is no session-bound
-- secret an RLS predicate could check for that model, so PART 1 below
-- enables RLS with deliberately zero policies rather than writing
-- auth.uid() ownership policies that would be both incorrect (they'd
-- assume session-based ownership this app doesn't use) and irrelevant
-- (the app never reads these tables through a role RLS applies to).
-- ============================================================================


-- ============================================================================
-- PART 1 — Private/internal application tables.
-- Enable RLS, add NO policies. With RLS on and zero policies, `anon` and
-- `authenticated` get zero rows on SELECT and a policy-violation error on
-- INSERT/UPDATE/DELETE. `postgres` (Prisma, both pooled and direct
-- connections) and `service_role` are unaffected (rolbypassrls = true).
-- ============================================================================

ALTER TABLE public.stories               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_projects     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scratch_card_gifts    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treasure_hunts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_boxes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.love_wrapped          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_books          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationship_quizzes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_envelopes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fortune_cookies       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_quizzes        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.open_when_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.date_generators       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hundred_reasons       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback              ENABLE ROW LEVEL SECURITY;


-- ============================================================================
-- PART 2 — Public catalog tables.
-- Seed/catalog content only (template name, category, description,
-- seedScenes JSON) — no user data, no PII. Genuinely meant to be publicly
-- readable. Writes only ever happen via prisma/seed.ts through the
-- `postgres` role, which bypasses RLS regardless, so no write policies
-- are added for anon/authenticated.
-- ============================================================================

ALTER TABLE public.story_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates       ENABLE ROW LEVEL SECURITY;

CREATE POLICY "story_templates_public_read" ON public.story_templates
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "templates_public_read" ON public.templates
  FOR SELECT
  TO anon, authenticated
  USING (true);


-- ============================================================================
-- PART 3 — Prisma's own migration bookkeeping table.
-- Not application data. RLS alone cannot restrict `service_role` (it
-- bypasses RLS by design), so this also explicitly REVOKEs table-level
-- privileges from anon, authenticated, AND service_role — nothing in this
-- app legitimately needs any of the three to touch this table via the
-- API. The `postgres` role is untouched: `prisma migrate deploy` and
-- `prisma migrate dev` connect via DIRECT_URL as `postgres` (verified
-- live), not as service_role, and are unaffected by either the RLS or the
-- REVOKE below.
-- ============================================================================

ALTER TABLE public._prisma_migrations ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public._prisma_migrations FROM anon, authenticated, service_role;
