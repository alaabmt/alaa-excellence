# Metrics check — article-agentic-ai-hidden-failures-trajectory-audit

All arithmetic below was independently recomputed. “Approx.” means reverse-calculated from a rounded percentage and must not be presented as a source-published integer.

## Corpus composition

| Metric | Calculation | Result | Publication wording |
|---|---:|---:|---|
| Full corpus | 1,851 + 565 + 102 | 2,518 | Exact |
| Traverse subset | 600 + 721 + 102 | 1,423 | Exact |
| Traverse failed | 306 + 541 + 38 | 885/1,423 = 62.2% | Use counts first; percentage optional |
| Traverse correct | 294 + 180 + 64 | 538/1,423 = 37.8% | “Correct” is benchmark-labelled, not necessarily safe |

## Classified mistakes

| Family | Source count | Check | Result |
|---|---:|---:|---:|
| Action/execution | 3,144 | 3,144 ÷ 6,967 | 45.127% → 45.1% |
| Planning/strategy | 1,674 | 1,674 ÷ 6,967 | 24.028% → 24.0% |
| Combined | 4,818 | 4,818 ÷ 6,967 | 69.156% → about 69.2% |
| Other families | 2,149 | 2,149 ÷ 6,967 | 30.844% |

Check: 3,144 + 1,674 + 2,149 = 6,967.

## First-mistake signature — base n=1,122

| Source percentage | Approx. numerator | Complement | Required wording |
|---:|---:|---:|---|
| 69.5% no recovery | 780/1,122 | approx. 342/1,122 recovered | “approximately 780 of 1,122” |
| 38.5% no self-detection | 432/1,122 | approx. 690/1,122 flagged it | “approximately 432 of 1,122” |
| 72.6% persisted | 815/1,122 | approx. 307/1,122 did not | “approximately 815 of 1,122” |
| 13.7% all three | 154/1,122 | approx. 968/1,122 not all three | “approximately 154 of 1,122” |
| 46% reasoning/planning first errors | 516/1,122 | approx. 606/1,122 other families | “approximately 516 of 1,122” |
| 24% action first errors | 269/1,122 | approx. 853/1,122 other families | “approximately 269 of 1,122” |

Rounding check: each reconstructed numerator maps to the source percentage within ±0.05 percentage point.

## Safety audit — base 65 flagged unsafe actions

| Finding | Reconstruction | Complement | Required wording |
|---|---:|---:|---|
| Unnecessary | 65/65 = 100% | 0/65 | Exact source statement |
| No risk acknowledgement | approx. 63/65 = 96.9% | approx. 2/65 | Source reported 97% |
| Irreversible | approx. 49/65 = 75.4% | approx. 16/65 | Source reported 75% |
| Solved runs containing irreversible destructive action | 3–14 runs | Not applicable | Preserve range; judge disagreement |

Do not combine the three safety categories: one action may be both unacknowledged and irreversible.

## Frontier first-error localization

| Domain/judge | Denominator | Source rate | Approx. correct | Approx. incorrect |
|---|---:|---:|---:|---:|
| SWE-bench / Gemini 3.1 Pro | 306 failed trajectories | 26.80% | 82/306 | 224/306 |
| TerminalBench / GPT-5.5 | 541 failed trajectories | 32.34% | 175/541 | 366/541 |
| BixBench / GPT-5.5 | 38 failed trajectories | 63.16% | 24/38 | 14/38 |

The strongest model differs by domain. Do not describe one configuration as the universal leader.

## Scout best-of-N selection

| Benchmark | Task denominator | Candidate trajectories | Single attempt | Scout selection | Difference |
|---|---:|---:|---:|---:|---:|
| Terminal-Bench 2.0 | 89 tasks | 445 | 81.8% | 90.2% | +8.4 percentage points |
| SWE-bench Verified | 500 tasks | 1,498 | 75.6% | 78.0% | +2.4 percentage points |

The paper publishes rounded task-success percentages but not integer task counts for each rate in the accessible text. Do not invent numerators. State the denominators and label percentages as published rounded rates. This was fixed-pool selection, not live recovery.

## Secondary READY context

- 16 systems; 750 cases.
- Autonomous accuracy: 72.8% versus 72.5%.
- Human review needed: 39.2% versus 29.6%.
- Reliability target: 76%.
- Integer allocations for percentages are not published on the accessible landing page; do not reconstruct them because the per-system case allocation is not specified.

## Final numerical gate

PASS. Every used percentage will carry a count/denominator or an explicit statement that the source did not publish the required allocation. No benchmark result will be described as production accuracy or safety.
