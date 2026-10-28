# Evidence Pack — Long-horizon computer workflows

## Source hierarchy

1. Primary: Yuan M, et al. *OSWorld 2.0: Benchmarking Computer Use Agents on Long-Horizon Real-World Tasks*. arXiv:2606.29537 (28 June 2026). https://arxiv.org/html/2606.29537
2. Secondary context only: Pan MZ, et al. *Measuring Agents in Production*. ICLR 2026 Workshop on Agents in the Wild. https://openreview.net/pdf?id=AsvLggSOvS

## Claim matrix

| Claim | Direct source location | Evidence type | Confidence | Limitation |
|---|---|---|---|---|
| Benchmark contains 108 tasks across 31 self-hosted services | Primary §§1, 2.2 | Released benchmark description | High for the released benchmark | Not a random sample of all office work |
| Median skilled-human time ≈1.6 hours | Primary Fig. 3 and §2.2.1 | Human annotation/operation estimate | Moderate–high | Median estimate, not a controlled labor-time study |
| 69.6% require more than one human hour | Primary §2.2.1 | Benchmark task-time annotation | Moderate–high | Rounded percentage; denominator 108, exact numerator not published in prose |
| 27.25 scoring checkpoints per task on average | Primary §2.1.3 | Evaluation design | High | Average hides task variation |
| Model judgment is 11.53% of score; ≤50% for any task | Primary §2.1.3 | Evaluation design | High | Some open-ended checks still depend on a model judge |
| Top configuration: 20.6% binary, 54.8% partial | Primary Table 3 | Controlled benchmark result | High in benchmark conditions | Rounded aggregate across 108 tasks; no integer numerator exposed |
| Approximate 22/108 complete-equivalents and 86/108 non-complete-equivalents | Arithmetic from 20.6% × 108 | Reader aid | Moderate | Explicitly approximate; not raw task counts |
| GPT-5.5: 13.0% binary, 49.5% partial, 37.1K tokens, ~$25.5/task | Primary Table 3 | Controlled benchmark result and cost estimate | High/Moderate | Cost is approximate and vendor-price dependent |
| Opus 4.8 top: 224K tokens, ~$72.4/task, 481.8 tool calls/task | Primary Table 3 | Controlled benchmark result and cost estimate | High/Moderate | Same cost caveat; batched-action condition differs from single-action systems |
| Longest bin: 0/17 strict completion per listed model | Primary Table 21 | Subgroup result | High within this subgroup | Four configurations; 17 selected tasks; not general production accuracy |
| Agents spend under 7% of budget on error detection/repair | Primary §§1, 3.2 | Trajectory analysis | Moderate–high | Budget accounting depends on study coding |
| Hidden-state, multi-item, conflict and dynamic tasks are bottlenecks | Primary §3.2 and Appendix G | Exposure/trajectory analysis | Moderate | Overlapping phenomenon tags prevent causal attribution to one factor |
| 74% use human-in-loop evaluation | Secondary paper RQ3 | Survey | Moderate–high | Survey sample and self-report; denominator differs by question |
| 75% of interviewed teams lack formal benchmark sets | Secondary paper §6.1 | 20 deployment-team case studies | Moderate | 15 of 20 teams; not a population prevalence estimate |

## What was simulated and what was real

- The workflows run in controlled computer environments with self-hosted replicas of email, banking, chat and business portals. This is a benchmark simulation, not live production operation.
- Input artifacts were collected or adapted from realistic materials; synthetic records were used when privacy or controllability required them.
- A simulated user answered bounded clarification questions.
- Human annotators re-solved tasks, but the reported model scores are agent results in the benchmark environment.

## Prohibited overclaims

- Do not call 20.6% general workplace accuracy.
- Do not call the remaining 79.4% all “wrong answers”; they include partially completed workflows that failed strict end-state completion.
- Do not claim the top model completed exactly 22 tasks unless raw trajectory counts are confirmed; use “about 22 task-equivalents after rounding.”
- Do not equate a 54.8% partial score with 54.8% of tasks completed.
- Do not infer that 500 allowed steps or higher spending will guarantee completion.
- Do not infer that simulated portal behavior equals live system reliability or safety.
