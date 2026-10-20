# Tamayuz 10X Work Automation Checkpoints

This directory is the durable source of truth for resumable ChatGPT Work automations. Conversation memory is useful but never authoritative.

## Registry and states

- `workflows-registry.json` maps every active automation to its state file and artifact root.
- Each primary task reads its state before starting a cycle.
- The hourly coordinator resumes unfinished work and never duplicates a primary start.

Valid states are `completed`, `in_progress`, `retry_waiting`, `blocked`, `reconciling`, and `idle`.

## Checkpoint boundary

After every completed stage, save the artifacts, re-read the state and branch head, update the completed stage and `next_action`, then commit both state and artifacts before beginning the next stage. Never mark a stage complete before its artifacts exist.

## Lease and concurrency

Acquire a 110-minute committed lease containing `owner`, `acquired_at`, and `expires_at`. Skip a workflow with an unexpired lease. Re-read the state before every write. If it changed, reconcile with the newer state instead of overwriting it. A lease never substitutes for a required platform confirmation.

## Interruptions and uncertain effects

Resume only from a completed stage boundary. If an external write may have succeeded, use `reconciling`, inspect the target, and never blindly replay it. On a usage limit, keep the last valid checkpoint. If a safe write remains possible, set `retry_waiting`, preserve `next_action`, record the blocker, release the lease, and let the hourly coordinator retry.

## Starting cycles

Primary schedules start cycles. The coordinator resumes incomplete work only, except that it also starts the daily Qur'anic reflection at or after 17:00 Asia/Dubai. A new cycle requires the previous one to be `completed` or explicitly `blocked`, plus the workflow's cadence and duplicate checks.

Publication completes only after final commit, checks, GitHub Pages, live pages, indexes and bilingual counterparts are verified. Monitoring and document workflows complete when their dated artifacts exist and delivery is recorded.
