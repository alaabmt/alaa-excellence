# Evidence Pack — article-agentic-ai-web-agent-evaluation-audit

Evidence hierarchy: direct primary paper first; primary benchmark and primary secondary-study paper only for context. Percentages are always paired with their published numerator and denominator where available.

| ID | Claim / number | Direct source | Source type | Confidence | Evidence limit |
|---|---|---|---|---|---|
| E1 | WebArena-Lite contains 165 tasks across shopping, shopping administration, Reddit, GitLab and map environments. | Gan et al. §3.1: https://arxiv.org/html/2610.01491v1#S3.SS1 | Primary study | High | A selected benchmark, not the open web or production traffic. |
| E2 | Six conditions were evaluated: four GPT-5.5 settings and two untrained Qwen3.5-9B settings; each task-condition had one rollout. | Gan et al. Table 1 and §6: https://arxiv.org/html/2610.01491v1#S5.SS1 | Primary study | High | One rollout does not estimate repeated-run reliability. |
| E3 | Strongest audited GPT-5.5 condition, Guide Text + MASM, 25 steps: automatic evaluator accepted 51/165 (30.91%); human audit verified 63/165 (38.18%); 12/165 (7.27 percentage points) were recovered false negatives. | Gan et al. Table 1: https://arxiv.org/html/2610.01491v1#S5.SS1 | Primary study | High | Human correction is judgment-based under fixed rules; not a production accuracy measure. |
| E4 | The corresponding failure counts are 114/165 raw failures and 102/165 verified failures after correction. | Direct subtraction from E3: 165−51 and 165−63. | Transparent reconstruction | High | Derived counts; the paper directly reports successes and recovered cases. |
| E5 | GPT-5.5 + MASM, 25 steps: 43/165 raw (26.06%), 57/165 corrected (34.55%), 14/165 recovered (+8.49 pp). | Gan et al. Table 1 | Primary study | High | Same single-rollout and human-label limits. |
| E6 | GPT-5.5 + MASM, 15 steps: 49/165 raw (29.70%), 58/165 corrected (35.15%), 9/165 recovered (+5.45 pp). | Gan et al. Table 1 | Primary study | High | 15- and 25-step rows are not directly comparable because budgets differ. |
| E7 | GPT-5.5 + Guide Text + MASM, 15 steps: 49/165 raw (29.70%), 61/165 corrected (36.97%), 12/165 recovered (+7.27 pp). | Gan et al. Table 1 | Primary study | High | Same limits. |
| E8 | Across four GPT-5.5 settings, human review recovered 47 outcomes; average 11.75 per setting and 7.12 pp. | Gan et al. §5.1 | Primary study | High | The denominator is four settings × 165 task runs, not 47 unique tasks. |
| E9 | At 25 steps, Guide Text + MASM corrected 63/165 vs MASM-only 57/165, a net +6 tasks (+3.64 pp). Yet 34/165 tasks (20.61%) flipped: 20 Guide-only wins and 14 MASM-only wins. | Gan et al. Tables 3 and §5.4 | Primary study | High | Exact paired test p=.392; not statistically significant at conventional thresholds. |
| E10 | Among 143 tasks with a guide at 15 steps: 53/143 (37.06%) vs 56/143 (39.16%), with 7 gains and 4 regressions. Among 22 without a guide: 5/22 (22.73%) in both, with 1 gain and 1 regression. | Gan et al. Table 2 | Primary study | High | Guides were observational and varied in specificity. |
| E11 | The strongest audited condition had 102 verified failures. Primary failure modes: scroll oscillation 32/102 (31.4%); unfinished exploration 13/102 (12.7%); premature answer 13/102 (12.7%); invalid action format 9/102 (8.8%); incomplete form/edit 8/102 (7.8%); remaining modes 27/102 (26.5%). | Gan et al. Table 6 | Primary study | High | One primary label per failed trajectory compresses multi-cause failures. |
| E12 | Structured progress was extractable for 91/165 (55.2%). Among 102 failures, 18/102 (17.6%) self-reported ≥80% and 7/102 (6.9%) self-reported 100%. Of 40 analyzable action-limit failures, 8/40 (20.0%) reached ≥80% verified progress and 0/40 (0%) reached 100%. | Gan et al. Table 7 | Primary study | High | Progress was only available for a subset and was used to locate evidence, not as truth. |
| E13 | Guide-only successes at 25 steps used mean 8.9 actions vs 15.0 without the guide; median 7 vs 14; action-limit runs 1 vs 7, on the 20 paired flip tasks. | Gan et al. §5.4 and Appendix D | Primary study | High | This is a selected flip subset, not all 165 tasks. |
| E14 | Correction required recorded environment or final-answer evidence; unsupported intentions, partially completed forms, inferred answers without page evidence, and memory claims conflicting with the environment were not corrected. | Gan et al. Appendix B | Primary study protocol | High | Human adjudication can still vary despite rules and second review of ambiguous cases. |
| E15 | Qwen3.5-9B raw evaluator result rose from 23/165 (13.90%) to 31/165 (18.80%) with MASM. | Gan et al. Table 1, §5.2 | Primary study | High | These Qwen runs were not human-corrected; do not compare their raw score with corrected GPT rows as equivalent measures. |
| E16 | AgentRewardBench contains 1,302 trajectories across five benchmarks and four LLMs, each expert-reviewed; no single tested LLM judge excelled across all benchmarks and rule-based methods tended to underreport success. | Lù et al. abstract: https://arxiv.org/abs/2504.08942 | Primary secondary study | High | Side-box context; it does not reproduce the 165-task audit and must not interrupt the primary story. |
| E17 | WebArena originally published 812 long-horizon tasks and evaluated functional correctness in self-hosted sites; the 2023 GPT-4 baseline reached 14.41%, while a human sample covered one task from each of 170 templates and reached 78.24%. | Zhou et al. §§3–5: https://arxiv.org/html/2307.13854v4 | Primary benchmark paper | High | Human rate is from 170 sampled tasks, not all 812; do not infer 635/812 human successes. |

## What the source claims vs what is established
- **Source claim:** trajectory-aware, human-grounded verification improves reliability of web-agent evaluation.
- **Established by this study:** in these recorded runs, strict automatic evaluation missed 9–14 successes per 165-task GPT-5.5 condition, and the authors documented recurrent failure patterns.
- **Not established:** production reliability; general accuracy of GPT-5.5; causal superiority of Guide Text; stability across repeated runs; safety of autonomous browser actions.

## Direct limitations to retain in both languages
1. One rollout per task-condition.
2. 15- and 25-action budgets are not directly comparable.
3. Qwen rows were evaluator-only and not human-corrected.
4. Human labels remain judgment-based.
5. Structured progress exists for 91/165 tasks only.
6. Guide Text was not randomized; 22 tasks lacked a guide and guide specificity varied.
7. At least one possible state-carryover case and one leakage-risk guide were retained but flagged.
8. API behavior, website state, and authentication may vary across reruns.
9. Simulated/self-hosted benchmark conditions are not the same as live production deployment.
