# Tamayuz Live Guardian — private skill-only plugin

Scope: `https://tamayuz10x.com/live/`, repository `alaabmt/alaa-excellence`, and the `tamayuz-live` Supabase Edge Function in the existing `tamayuz10x-auth` project.

## What it does

A single guardian orchestrates four specialist workflows: frontend/mobile, backend/Supabase, security, and testing/deployment. Skills are instructions, not independent background agents. The plugin does **not** install a monitoring daemon or automatically obtain GitHub/Supabase permissions. Existing authorized integrations are used only when connected and available.

## Repository location

Keep this package's maintained source at `automation/plugins/tamayuz-live-guardian/`. Scope future development with `live/AGENTS.md`; keep application architecture current in `live/README.md`. Do not place `plugin.json` or the plugin skills inside the deployed `live/` web directory.

## Workflow and safety

1. Inspect evidence and current deployed state before proposing a change.
2. Reproduce or explicitly mark unverified; determine the smallest scope.
3. Prepare changes on a GitHub branch, never silently mutate `main`.
4. Test static syntax, browser/mobile navigation, presenter/audience, authorization, and data invariants as applicable.
5. Check GitHub Pages and Supabase separately; a merged branch is not a deployed backend.
6. Obtain explicit approval for production deployment, destructive DB changes, quotas/cost-affecting operations, or production load tests.
7. Verify results and report known limitations.

See `skills/tamayuz-live-guardian/SKILL.md` and its references. The project source contains no credentials or presenter links.
