# Tamayuz Live — event-day operating procedure

Scope: Tamayuz Live only (`/live/`, Edge Function `tamayuz-live`, `live_*` tables). This is the working procedure for a conference session. It does not replace the readiness decision in the evidence register.

## 1. People (fill in before the event — not yet assigned)

| Role | Name | Phone / channel | Notes |
|---|---|---|---|
| Event owner (decides GO, pause, fallback) | **NOT ASSIGNED** | | Signs the release approval |
| Presenter host (runs the presenter screen) | **NOT ASSIGNED** | | Holds the private presenter link |
| Primary on-call (technical) | `alaabmt` (GitHub issue assignee) | | Receives GitHub issue e-mail |
| Backup on-call (technical) | **NOT ASSIGNED** | | Must have Supabase and GitHub access |
| Room contact (tells the audience what to do) | **NOT ASSIGNED** | | Uses the fallback script in section 6 |

Until the three empty rows are filled and each person has acknowledged one test alert, the operations gate stays NOT VERIFIED.

## 2. Timeline

**Seven days before**
- Decide the Supabase plan for the event month. At the page's 3-second polling, 600 attendees make about 720,000 function calls per hour; the Free plan includes 500,000 per month. See "Capacity and quota" in the evidence register.
- Deploy the backend following `deploy-hot-path.md` and repeat the 10-client diagnostic.
- Take a protected backup and restore it (`recovery/README.md`). File the restore report.
- Run the owner self-check page while signed in and share the sanitized result with the verifier.

**One day before**
- Freeze: no merges to `live/**` and no Edge deployments after this point, except an approved fix.
- Record: main commit SHA, Pages deployment run, Edge Function version, row counts of the eight tables.
- Take a fresh protected backup after the last question edit.
- Create the session. Send the private presenter link to the presenter host only.
- On the real presenter laptop and projector: open the link, open voting, vote from two phones (one Android, one iPhone, one in Arabic), close, reveal, end. Then create the real session again if the test session was ended.

**Sixty minutes before**
- Run the health workflow manually; it must report HEALTHY with `db_path_pinned` under 1500 ms.
- Open the presenter link on the presenter laptop. Keep a second device signed in as owner.
- Confirm on-call people are reachable. Start an event log (time, action, person).

**During the session**
- Show only the public join code or QR. Never project the presenter link or an owner page.
- One person changes questions. Wait for "Voting is open" before speaking to the audience.
- If attendees report problems, follow section 4 before changing anything.

**After the session**
- End the session. Export analytics. Take a protected backup. Record final counts.
- Close the event log with incidents, times and decisions.

## 3. What "healthy" looks like

| Signal | Healthy | Act when |
|---|---|---|
| Health workflow | HEALTHY | CHECK FAILED twice, or no run for 30 minutes |
| `db_path_pinned` latency | under 1500 ms | over 3000 ms twice |
| Presenter screen | response count rises after opening | no change for 20 seconds while phones show the question |
| Audience phones | question appears within about 5 seconds | "Connection interrupted" on many phones for over 30 seconds |

## 4. Incident playbook

| Symptom | First action (under 1 minute) | If not solved |
|---|---|---|
| Many phones show "Connection interrupted" | Wait 30 seconds: phones retry by themselves and back off. Check the Supabase status page and the function logs. | Go to fallback (section 6). Do not reset the session. |
| Phones say "Session capacity reached" | The session has 600 registrations. Ask attendees to reopen the tab they already used (identity is kept). | Owner creates a second session and shows the new code to those who could not join. |
| Presenter buttons answer "Concurrent update" | Only one device may control. Close other presenter tabs, press the button again. | Reload the presenter link. |
| Question opened but phones still wait | Check that a question is selected and status says "Voting open". Use Next/Previous once and return. | Reload presenter page; state is stored on the server. |
| Votes look too low | Compare "responses" on the presenter screen with the room. Late phones can still vote while voting is open. | Keep voting open longer. Never reset during the session. |
| Page does not load at all | Check `https://tamayuz10x.com/live/` from mobile data. | If GitHub Pages is down, fallback (section 6). |
| Wrong answer revealed too early | Press "Hide correct answer". | Move to the next question. |

Rules during an incident: do not run SQL on production, do not reset or delete a session, do not deploy. Decide pause or fallback within 3 minutes. Log every action.

## 5. Rollback and recovery

- **Page:** revert the last merge on `main` (GitHub → the merged pull request → Revert → merge). Pages republishes in about one minute. Verified on 2026-11-13 that reverting the latest Live change restores `live/index.html` byte for byte (see evidence register).
- **Edge Function:** redeploy the previous version source. Data is not affected. Steps in `deploy-hot-path.md`.
- **Data:** production has no automatic backups on the current plan. The only recovery source is the protected backup taken before and after the event. Restore into a new isolated database first, verify with `live-restore-verify.sh`, and copy data back to production only with the event owner's written approval. Never overwrite production to "test" a restore.
- **Lost presenter link:** the owner ends the session and creates a new one; tokens cannot be re-issued.

## 6. Fallback when Live cannot be used

1. Room contact announces: "We will take this question by show of hands."
2. Presenter continues with the slides; answers are counted by hand or skipped.
3. On-call keeps investigating without touching session data.
4. Return to Live only when the health workflow is green and two phones can vote.

## 7. Alert acknowledgement

An alert is a GitHub issue titled "[Tamayuz Live] Production health incident", assigned to the primary on-call. Acknowledge by commenting "ACK <name> <time UTC>" within 10 minutes. If there is no acknowledgement in 10 minutes, the event owner phones the backup on-call. The monitor closes the issue automatically after recovery; the on-call adds a short cause note.

GitHub does not guarantee scheduled runs (on 2026-11-13 only one of about 24 expected runs started in six hours with the old schedule). During the event window, a person watches the presenter screen and runs the health workflow manually every 15 minutes; the schedule is a second line, not the first.
