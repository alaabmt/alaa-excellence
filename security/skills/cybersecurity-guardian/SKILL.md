---
name: cybersecurity-guardian
description: Defensive security assessment and evidence-based risk reporting for the Tamayuz 10X GitHub Pages, GitHub Actions, Cloudflare, Supabase, and authentication surface.
---

# Cybersecurity Guardian Skill

## When to invoke
Security audit, pre-release security review, GitHub Actions hardening, secrets exposure triage, account/admin/Supabase authorization review, incident-response preparation, or security finding validation.

## Prerequisites
Read `AGENTS.md`, `10X_Agent_AI_Master_Operating_Manual_AR.md`, and `security/CYBERSECURITY_GUARDIAN_AGENT.md`. Confirm scope and access. Use least privilege; inspect only authorized assets.

## Procedure
1. Determine target commit, assets, data sensitivity, and threat model.
2. Run `python3 scripts/cybersecurity_guardian.py --root . --output security-report.json` locally or inspect the latest GitHub Actions run.
3. Review potential findings manually; classify false positives; never paste credential values.
4. Inspect workflow permissions, pinned action refs, third-party scripts, dependency manifests, auth and RLS policy, CORS/CSP, and security headers.
5. If live-provider access is available, verify actual Cloudflare/Supabase settings read-only. Mark unavailable checks NOT VERIFIED.
6. Produce a scoped report with severity, confidence, evidence, remediation, responsible owner, and retest steps.
7. For code changes, propose a PR and request approval for production-sensitive changes. Never auto-remediate credentials or authentication.

## Output contract
`PASS` (scoped checks only), `REVIEW` (manual validation required), or `STOP` (confirmed critical/high issue). Include findings and unknowns. Never claim full security certification.

## Guardrails
No exploitation, destructive probing, exfiltration, credential testing, user enumeration, production changes, or public disclosure of sensitive findings. Escalate privately.
