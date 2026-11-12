# Tamayuz Live Assurance — Level 4 engineering controls

This folder belongs **only to Tamayuz Live**. The offline gate performs no network calls or database writes. It validates changed-file scope and metadata of conference evidence; it does **not** prove external artifact authenticity, production load, continuous monitoring, recovery or uptime.

## Green CI is not a conference GO

`.github/workflows/tamayuz-live-assurance.yml` verifies the Live-only changed-path allowlist and runs nine policy tests plus Live static regressions. For every push/PR it generates a deliberate **NO-GO** report using `readiness-evidence.example.json`, until separate true production-like evidence is collected. The generated example must not be called a readiness certificate. A red workflow only blocks merging when the repository branch-protection/ruleset explicitly requires this workflow; verify that separately.

### Scope
Allowed modified repository paths: `live/**`, `tests/tamayuz-live-*`, `.github/workflows/tamayuz-live-*`. For Supabase only `tamayuz-live` Edge Function and `live_*` objects. CPHQ, shared Auth, root navigation, generic site QA and global workflows are **OUT OF SCOPE / NO ACTION**.

### Running tests
```bash
python3 -m unittest discover -s live/qa -p 'test_*.py' -v
python3 live/qa/assurance_gate.py --evidence live/qa/readiness-evidence.example.json
```
The second command **must exit 3 (NO-GO)**, because the sample has no evidence.

### Conference verification
Collect genuine version-matched proof for all eight P0 gates: deployment integrity, real authorization, real full-stack audience/presenter flows, certified concurrent capacity, proven monitoring and alert delivery, isolated restore drill, vote integrity, anti-abuse. Also document four P1 gates: real physical devices, accessibility, privacy and independent security. Each PASS must cite an actual original HTTPS artifact, SHA256, UTC timestamp, environment, frontend SHA, Edge version and independent verifier. Review and verify the actual artifact outside this metadata tool.

P0 failures or missing evidence never permit GO. P1 exceptions require a dated human signoff. No automation can invent approval or guarantee uptime. Never run production load or destructive reset to gather evidence without a separately approved safe test plan.

The metadata gate exit codes are: **0=GO** (metadata eligible, artifacts still require verification), **2=CONDITIONAL GO** (all P0 metadata eligible and signed P1 waivers), **3=NO-GO**. No automatic deployments, monitoring schedules, configuration changes or cleanup are performed by the gate.

For the canonical scope and operational controls, use the private Tamayuz Live Guardian v1.0 plugin runbooks; a plugin installation alone does not configure actual monitoring.
