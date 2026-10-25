# Research notes — article-agentic-ai-web-agent-evaluation-audit

## Selection decision
- **Selected primary study:** Gan et al., “Auditing Web Agent Evaluation on WebArena-Lite: Human Review of Outcomes and Trajectories,” arXiv:2610.01491v1, 1 October 2026.
- **Institutions:** Techtouch, Inc. and Institute of Science Tokyo.
- **Why selected:** it addresses a concrete governance problem: an automatic evaluator may label a completed browser task as a failure, while an agent's self-report may claim completion without environment evidence. The paper publishes counts, denominators, correction rules, failure modes, and limitations.
- **Duplicate check:** no 2026-10-25 Agentic AI item existed in the durable state, repository search, recent commits, or specialist hub. Existing Agentic AI pages cover customer-service construction, human approval, compute scheduling, productivity measurement, vulnerability hunting, workplace tasks, excessive agency, knowledge-work autonomy, and clinical selective autonomy; none covers evaluator false negatives and trajectory auditing.

## Proposed publication
- Arabic title: **عندما ينجز وكيل الويب المهمة لكن الاختبار يعلن فشله: مراجعة بشرية لـ165 مهمة**
- English title: **When a Web Agent Finishes the Job but the Test Says “Failed”: A Human Audit of 165 Tasks**
- Slug: `article-agentic-ai-web-agent-evaluation-audit`
- Publication date: 2026-10-25 (Asia/Dubai)

## Story spine
1. Concrete problem: a browser agent reaches the required state but a strict answer format or stop command causes the automated test to record failure.
2. Brief definition: a web agent is an AI system that converts a goal into a sequence of browser actions; an automatic evaluator judges whether the final result satisfies the task.
3. What the researchers did: audited all 165 WebArena-Lite tasks across six conditions, manually reviewed raw failures for four GPT-5.5 settings, corrected only evidence-backed false negatives, and labeled the first consequential error.
4. Results: total 165; strongest audited condition raw 51/165 vs corrected 63/165; therefore 114/165 raw failures become 102/165 verified failures, with 12 recovered false negatives.
5. Breakdown: 102 verified failures, including 32 scrolling oscillations, 13 unfinished explorations, 13 premature answers, 9 invalid action formats, 8 incomplete forms/edits, and 27 other defined failures.
6. Hypothetical application, explicitly labeled: a benefits portal agent that updates an address; approval depends on database state, audit trace, and explicit completion gate—not the agent's prose.
7. Limits: one rollout per task-condition, non-random Guide Text, variable guide specificity, 22 tasks without guides, possible state carryover, one leakage-risk guide, API/site/auth variability, judgment-based human labels, progress available for 91/165 only.
8. 10X decisions: dual scorecard (raw + adjudicated), preserve trajectory evidence, repeated-action detector, explicit save/submit verification, pilot with paired task flips, and a risk-tiered human review queue.

## Sources read directly
1. Primary paper HTML: https://arxiv.org/html/2610.01491v1
2. Primary paper abstract: https://arxiv.org/abs/2610.01491
3. Secondary side-box paper: AgentRewardBench, https://arxiv.org/abs/2504.08942
4. Benchmark origin/context: WebArena, https://arxiv.org/html/2307.13854v4

## Secondary side box
AgentRewardBench is supporting context only and will not interrupt the primary narrative. Its sample is 1,302 trajectories from five benchmarks and four source LLMs. It found that widely used rule-based evaluation under-reports successful trajectories; the 2026 audit adds task-level correction and failure diagnosis on a fixed 165-task set.

## Editorial cautions
- Do not call corrected success “accuracy”; it is verified task completion for one benchmark rollout.
- Do not generalize 63/165 to production reliability.
- Do not imply Guide Text caused a stable improvement: exact paired tests were not significant and guides were observational.
- Distinguish the simulated/self-hosted benchmark from live production websites.
- Distinguish the paper's claims from what the counts establish.
