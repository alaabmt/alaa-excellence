# Publication packages

This directory records evidence packs and preflight state for publication candidates. It does not execute publishing logic.

Normal publication path: Prepare → Preflight → Validate → Commit → CI → Deploy → Verify Public URLs → DONE.

Do not add one-time GitHub Actions or dynamically execute code extracted from YAML/Markdown. Reusable automation belongs under `scripts/` and permanent workflows.
