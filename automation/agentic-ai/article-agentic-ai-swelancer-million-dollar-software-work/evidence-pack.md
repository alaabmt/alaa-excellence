# SWE-Lancer Evidence Pack

- **Workflow:** Agentic AI 10X
- **Item:** `article-agentic-ai-swelancer-million-dollar-software-work`
- **Evidence cutoff:** 2026-11-11
- **Primary study:** Samuel Miserendino, Michele Wang, Tejal Patwardhan, and Johannes Heidecke, “SWE-Lancer: Can Frontier LLMs Earn $1 Million from Real-World Freelance Software Engineering?”, ICML 2025 / PMLR 267.
- **Purpose:** Establish the evidence boundary before metric reconstruction and drafting. Original-paper results and the July 2025 revised evaluation are intentionally kept separate because they use different task sets and corrected evaluation infrastructure.

## Source hierarchy

| ID | Source | Type | Date/version | Use |
|---|---|---|---|---|
| S1 | https://proceedings.mlr.press/v267/miserendino25a.html | Peer-reviewed primary paper landing page | ICML 2025 | Canonical paper identity, abstract, authors, publication details |
| S2 | https://raw.githubusercontent.com/mlresearch/v267/main/assets/miserendino25a/miserendino25a.pdf | Peer-reviewed primary paper PDF | ICML 2025 | Dataset construction, task splits, original model results, limitations |
| S3 | https://openai.com/index/swe-lancer/ | Official OpenAI release | 2025-02-18 | Public explanation and launch framing |
| S4 | https://github.com/openai/frontier-evals/blob/main/project/swelancer/README.md | Official released evaluation repository | Updated 2025-07-17 | Current offline-runnable public IC task subset and execution constraints |
| S5 | https://deploymentsafety.openai.com/deep-research/ability-to-run-code | Official OpenAI system card | Published 2025-02-25; SWE-Lancer note updated 2025-07-28 | Corrected July 2025 results, revised payout denominator, evaluation protocol |
| S6 | https://github.com/openai/SWELancer-Benchmark | Official archived repository | Archived 2025-07-18 | Provenance only; redirects users to the consolidated evaluation repository |

## Dataset and benchmark facts

| Claim | Exact evidence | Source | Confidence | Boundary / caveat |
|---|---|---|---|---|
| SWE-Lancer contains 1,488 real freelance software-engineering tasks worth exactly $1,000,000 in historical payouts. | Paper Table 1 and Section 2: 764 IC SWE + 724 SWE Manager = 1,488; $414,775 + $585,225 = $1,000,000. | S2 | High | “Dollars earned” means historical task payouts, not a forecast of current labor-market value. |
| Tasks come from Expensify’s open-source repository and were posted on Upwork. | Section 2 explicitly states this provenance. | S2 | High | This is one company/codebase and one freelance channel, not a representative sample of all software work. |
| Two task families are evaluated. | IC SWE requires producing a patch; SWE Manager requires selecting the best proposal from real alternatives. | S2, S5 | High | The two families have different graders and cannot be interpreted as one homogeneous skill. |
| IC SWE contains 764 tasks worth $414,775. | Section 2 and Table 1. | S2 | High | Original full private+public benchmark. |
| SWE Manager contains 724 tasks worth $585,225. | Section 2 and Table 1. | S2 | High | Original full private+public benchmark. |
| The original public Diamond split contains 502 tasks worth $500,800. | 237 IC tasks worth $236,300 plus 265 manager tasks worth $264,500. | S2 | High | This is the February/ICML paper version, not the July revised offline-runnable IC subset. |
| The July 2025 public repository has 198 IC tasks. | Repository note says 198 of the original 237 were adjusted and verified to run offline and 39 were dropped. | S4 | High | Manager tasks remain supported through the monolith image; this 198 figure is specifically about the IC public subset. |
| The corrected July 2025 Diamond evaluation has a maximum possible payout of $453,800. | OpenAI system card explicitly reports the revised denominator. | S5 | High | Do not combine this denominator with the original paper’s $500,800 results. |
| Original task payouts span from $50 bug fixes to $32,000 feature implementations. | PMLR abstract. | S1 | High | The body also describes the market-derived difficulty range; price is only a rough proxy for difficulty. |
| IC tests were written by professionals and triple-reviewed. | Paper: paid team of 100 professional engineers; end-to-end tests underwent three validation rounds. System card: each suite independently reviewed three times. | S2, S5 | High | Stronger than unit-test-only grading but still tied to test coverage and evaluator design. |
| Manager labels align with historical management decisions. | The chosen historical solution is ground truth; an additional expert campaign showed 99% agreement. | S2 | High | Agreement is not proof that the historical choice was uniquely optimal. |
| The Diamond set averaged about 26 days to resolution and 47 comments. | Paper reports 26.15 days and 47.01 comments overall for Diamond. | S2 | High | These are means over the selected Expensify issues, not model completion times. |
| Most tasks are bug fixes. | Diamond: 208/237 IC (87.76%) and 248/265 manager (93.58%). Full: 665/764 IC (87.04%) and 667/724 manager (92.13%). | S2 | High | The benchmark underrepresents greenfield development. |

## Original ICML/PMLR model results

All original-paper dollar figures below are rounded to the nearest thousand in Table 1. They must be labeled as February/ICML-era results and must not be presented as the corrected July 2025 leaderboard.

| Model / setting | Dataset | pass@1 | Dollars earned / total | Earn rate | Source |
|---|---:|---:|---:|---:|---|
| GPT-4o, user tool | IC SWE Diamond | 8.0% | $14k / $236k | 6.0% | S2 Table 1 |
| o1 high, user tool | IC SWE Diamond | 16.5% | $29k / $236k | 12.1% | S2 Table 1 |
| Claude 3.5 Sonnet, user tool | IC SWE Diamond | 26.2% | $58k / $236k | 24.5% | S2 Table 1 |
| GPT-4o | SWE Manager Diamond | 37.0% | $125k / $265k | 47.1% | S2 Table 1 |
| o1 high | SWE Manager Diamond | 41.5% | $137k / $265k | 51.8% | S2 Table 1 |
| Claude 3.5 Sonnet | SWE Manager Diamond | 44.9% | $150k / $265k | 56.8% | S2 Table 1 |
| GPT-4o | Combined Diamond | 23.3% | $139k / $501k | 27.7% | S2 Table 1 |
| o1 high | Combined Diamond | 29.7% | $166k / $501k | 33.1% | S2 Table 1 |
| Claude 3.5 Sonnet | Combined Diamond | 36.1% | $208k / $501k | 41.5% | S2 Table 1 |
| GPT-4o | Full 1,488 | 23.3% | $304k / $1m | 30.4% | S2 Table 1 |
| o1 high | Full 1,488 | 32.9% | $380k / $1m | 38.0% | S2 Table 1 |
| Claude 3.5 Sonnet | Full 1,488 | 33.7% | $403k / $1m | 40.3% | S2 Table 1 |

### Interpretation guardrails for the original results

1. The paper’s main conclusion is that even the strongest tested frontier model failed the majority of tasks.
2. Pass rate and earn rate diverge because task prices are uneven; neither metric can substitute for the other.
3. The combined score mixes patch-writing and proposal-selection performance.
4. Results depend on the supplied agent scaffold, reasoning effort, tool availability, rate limits, and evaluation infrastructure.
5. The full set includes a private holdout; only Diamond was publicly released.
6. The paper cautions against extrapolating from freelance tasks on an established codebase to all full-time or greenfield engineering work.
7. Tasks are text-only even when original issues contained screenshots or video, which may suppress multimodal performance.

## Corrected July 2025 evaluation facts

| Claim | Exact evidence | Source | Confidence | Boundary / caveat |
|---|---|---|---|---|
| OpenAI released an updated SWE-Lancer on 2025-07-17. | System card note dated 2025-07-28; official repository note. | S4, S5 | High | This postdates the original paper runs. |
| The update removed the internet requirement and corrected issues affecting dollars-earned results. | System card states both changes and says all results shown there were updated. | S5 | High | Original Table 1 values remain historical and should not be silently replaced. |
| Corrected results average three pass@1 runs across IC SWE and SWE Manager tasks. | Stated in the system card. | S5 | High | Averaging may yield fractional solved-rate values; it is not a single deterministic run. |
| The revised Diamond maximum payout is $453,800. | Explicitly stated in the system card. | S5 | High | Difference from $500,800 reflects the revised evaluation/task set; exact per-type revised denominators are not stated in the text view used here. |
| Post-mitigation deep research with browsing solved 53% of IC tasks and earned $87,708. | Explicit system-card result. | S5 | High | This is the revised IC evaluation, not the full combined benchmark. |
| $87,708 was nearly twice o1’s earnings. | Official qualitative comparison. | S5 | High | The exact revised o1 dollar figure is not stated in the accessible text and must not be reverse-engineered from “nearly twice.” |
| OpenAI observed no task-specific solution searching by browsing models after manual inspection. | System card statement. | S5 | Medium-high | Manual inspection is not a formal proof of zero contamination. |
| Open-source benchmark contamination remains possible. | Explicitly acknowledged by OpenAI. | S5 | High | This limits causal claims about browsing and underlying model capability. |

## Evidence-safe claims for the article

- Safe: “SWE-Lancer converts benchmark performance into the historical payouts attached to 1,488 real tasks.”
- Safe: “The original public Diamond split was worth $500,800; a July 2025 correction changed the evaluated public set and reduced the reported maximum payout to $453,800.”
- Safe: “In the original paper, the strongest tested model earned about 41.5% of Diamond’s payout and solved 36.1% of combined tasks.”
- Safe: “In OpenAI’s corrected July 2025 evaluation, the browsing deep-research model solved 53% of IC tasks and earned $87,708.”
- Safe: “A dollar score is an observed benchmark result, not a wage forecast or a claim that the model can replace an employee.”
- Unsafe: combining the 53% revised IC score with the original $500,800 Diamond denominator.
- Unsafe: saying models “earned” money in a live marketplace; they earned benchmark credit equal to historical payouts.
- Unsafe: saying 53% applies to all 1,488 tasks, to manager tasks, or to the combined benchmark.
- Unsafe: saying the benchmark proves workforce displacement or full job automation.
- Unsafe: treating historical price as a pure measure of technical difficulty.

## Remaining reconstruction requirements

The next stage must create `metrics-check.md` and:

1. Recompute every dataset subtotal and percentage used in the article.
2. Keep three namespaces distinct: full original set, original Diamond, revised July 2025 Diamond.
3. Mark rounded paper dollar values as rounded and exact system-card values as exact.
4. Verify any ratio or percentage before use, including:
   - 502 / 1,488 public-task share;
   - $500,800 / $1,000,000 original public payout share;
   - 39 / 237 dropped IC-task share;
   - revised payout delta of $47,000 from the original Diamond total;
   - exact relationship between 53% and the revised 198-task IC subset only if the system-card figure is confirmed to use that exact denominator.
5. Do not infer exact task counts from averaged pass@1 percentages.
6. Record publication/result dates alongside every leaderboard claim.
