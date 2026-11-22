// GitHub-only coverage monitor. Does not invoke Live or Supabase, and never
// treats green checks as conference launch authorization.
import assert from "node:assert/strict";

const repo = "alaabmt/alaa-excellence";
const workflow = "tamayuz-live-monitor.yml";
const title = "[Tamayuz Live] Scheduled monitoring coverage gap";
const token = process.env.GITHUB_TOKEN;
assert.equal(process.env.GITHUB_REPOSITORY, repo);
assert(token, "GITHUB_TOKEN required for coverage alert delivery");
const now = Date.now();
const cutoff = now - 75 * 60_000;
const headers = {
  authorization: `Bearer ${token}`,
  accept: "application/vnd.github+json",
  "x-github-api-version": "2022-11-28",
  "user-agent": "tamayuz-live-schedule-coverage",
};
async function github(method, path, payload) {
  const response = await fetch(`https://api.github.com/repos/${repo}${path}`, {
    method,
    headers: {...headers, ...(payload ? {"content-type": "application/json"} : {})},
    ...(payload ? {body: JSON.stringify(payload)} : {}),
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`GitHub API ${method} ${path}: HTTP ${response.status}`);
  return response.json();
}
const runs = await github("GET", `/actions/workflows/${workflow}/runs?event=schedule&per_page=100`);
assert(Array.isArray(runs.workflow_runs), "Workflow schedule runs unavailable");
const successful = runs.workflow_runs
  .filter(r => r.event === "schedule" && r.status === "completed" && r.conclusion === "success")
  .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
const last = successful[0] ?? null;
const latestAt = last ? Date.parse(last.created_at) : NaN;
const covered = Number.isFinite(latestAt) && latestAt >= cutoff;
const issues = await github("GET", "/issues?state=open&per_page=100");
const existing = issues.find(i => !i.pull_request && i.title === title);
const source = `https://github.com/${repo}/actions/workflows/${workflow}`;
const details = {
  checked_at_utc: new Date(now).toISOString(),
  threshold_minutes: 75,
  last_successful_schedule_created_at_utc: last?.created_at ?? null,
  last_successful_schedule_completed_at_utc: last?.updated_at ?? null,
  last_successful_schedule_url: last?.html_url ?? null,
  workflow_url: source,
  covered,
  conference_go: false,
};
console.log(JSON.stringify(details, null, 2));
if (!covered) {
  const body = [
    "**Monitoring coverage gap, not a confirmed Live outage.**",
    `No SUCCESSFUL schedule-triggered Live health run was created within 75 minutes of ${details.checked_at_utc}.`,
    `Latest successful schedule: ${last?.created_at ?? "not found"} (UTC).`,
    `Latest run: ${last?.html_url ?? "not found"}.`,
    `Workflow: ${source}`,
    "Check GitHub Actions scheduling, workflow enablement and queued jobs. Do not infer conference GO.",
  ].join("\n\n");
  if (!existing) {
    const issue = await github("POST", "/issues", {title, body, assignees: ["alaabmt"]});
    const readback = await github("GET", `/issues/${issue.number}`);
    assert.equal(readback.title, title, "Coverage alert read-back failed");
    console.log("Opened coverage issue:", readback.html_url);
  } else {
    console.log("Existing coverage issue:", existing.html_url);
  }
  process.exitCode = 1;
} else if (existing) {
  await github("POST", `/issues/${existing.number}/comments`, {
    body: `Schedule coverage restored at ${details.checked_at_utc}. Latest successful scheduled run: ${last.html_url}. This does not certify conference readiness.`,
  });
  await github("PATCH", `/issues/${existing.number}`, {state: "closed", state_reason: "completed"});
  console.log("Closed recovered coverage issue:", existing.html_url);
}
