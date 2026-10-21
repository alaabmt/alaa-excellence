# Research Notes — Measuring Agentic-AI Productivity When Work Changes

- Slug: `article-agentic-ai-productivity-measurement-bias`
- Publication date: 2026-10-21 (Asia/Dubai)
- Working Arabic title: **حين لا يريد المطورون العمل بلا وكيل ذكي: لماذا أصبح قياس الإنتاجية أصعب؟**
- Working English title: **When Developers Do Not Want to Work Without AI: Why Productivity Became Harder to Measure**

## Concrete operating problem

A software leader wants to know whether coding agents save time. A simple trial randomizes tasks into “AI allowed” and “AI disallowed.” Once agentic tools become embedded in daily work, however, some developers decline the study, omit tasks they would hate to do without AI, switch to different kinds of tasks, produce different levels of tests and documentation, or work on something else while several agents run. The experiment can then measure a selected remnant of the work rather than the transformation the organization is trying to understand.

## Primary research program

### Early-2025 randomized controlled trial

- Source: METR, 10 July 2025; paper revised 25 July 2025; anonymized data and regression code publicly available.
- Sample: 16 experienced open-source developers.
- Work: 246 real tasks from mature repositories; average participant experience with the repository about five years.
- Randomization: each task assigned to AI allowed or AI disallowed.
- Tools when allowed: mainly Cursor Pro with Claude 3.5/3.7 Sonnet.
- Measured result: tasks took 19% longer with AI; confidence interval +2% to +39%.
- Beliefs: participants expected a 24% speedup before work and still estimated a 20% speedup after.
- Scope: a point-in-time result for experienced developers in familiar, mature codebases—not a claim about every developer, tool, repository or future model.

### Late-2025 follow-up reported February 2026

- Source: METR, “We are Changing our Developer Productivity Experiment Design,” 24 February 2026.
- Sample: 57 developers (10 returning + 47 newly recruited), median 10 years of experience.
- Work: 800+ tasks across 143 repositories.
- Compensation: USD 50/hour, down from USD 150/hour in the first study.
- Raw estimates: returning developers showed an estimated 18% speedup with confidence interval from 38% speedup to 9% slowdown; new developers showed an estimated 4% speedup with interval from 15% speedup to 9% slowdown.
- Researcher judgment: these data are an unreliable signal and a likely bad proxy for real productivity because participation, task submission, task type, work quality, completion and time reporting changed.
- Selection signal: 30%–50% of surveyed developers said they withheld some tasks because they did not want to risk assignment to the no-AI condition.
- Concurrent-agent issue: some participants worked on unrelated tasks while agents ran, making “time on task” ambiguous.

## Article thesis

The important finding is not that agents are definitively slower or faster. It is that once an agent changes which tasks people choose, what quality they produce and how work overlaps, the old question “How long did this one task take?” ceases to measure the whole value of the new operating model.

## 10X lens

Measure the redesigned work system, not merely the speed of an isolated old task:
- cycle time from request to accepted result;
- active human minutes;
- agent runtime and concurrency;
- completed/abandoned work;
- review and rework;
- quality, tests and documentation;
- new tasks that were previously uneconomic;
- employee selection and adoption;
- cost and risk.

## Evidence threshold decision

Accepted as an evidence-led measurement case. The early trial is a controlled field experiment with public data; the follow-up is valuable precisely because its authors disclose why the newer estimate is unreliable. The article must not present the late-2025 raw speedups as established effects.
