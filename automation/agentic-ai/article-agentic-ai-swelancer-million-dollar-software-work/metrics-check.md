# SWE-Lancer Metrics Reconstruction

- **Item:** `article-agentic-ai-swelancer-million-dollar-software-work`
- **Inputs:** `evidence-pack.md`, ICML/PMLR paper Table 1 and Appendix A.12, OpenAI July 2025 system-card update, official evaluation repository.
- **Rule:** Never combine an original-paper numerator with a July 2025 revised denominator.

## 1. Dataset arithmetic

### Original full benchmark

| Quantity | Reconstruction | Result |
|---|---:|---:|
| Total tasks | 764 IC + 724 manager | 1,488 |
| Total payout | $414,775 + $585,225 | $1,000,000 |
| IC share of tasks | 764 / 1,488 | 51.34% |
| Manager share of tasks | 724 / 1,488 | 48.66% |
| IC share of payout | $414,775 / $1,000,000 | 41.48% |
| Manager share of payout | $585,225 / $1,000,000 | 58.52% |

**Check:** counts and payouts close exactly.

### Original Diamond split

| Quantity | Reconstruction | Result |
|---|---:|---:|
| Total tasks | 237 IC + 265 manager | 502 |
| Total payout | $236,300 + $264,500 | $500,800 |
| IC share of Diamond tasks | 237 / 502 | 47.21% |
| Manager share of Diamond tasks | 265 / 502 | 52.79% |
| IC share of Diamond payout | $236,300 / $500,800 | 47.18% |
| Manager share of Diamond payout | $264,500 / $500,800 | 52.82% |
| Diamond share of all tasks | 502 / 1,488 | 33.74% |
| Diamond share of all payout | $500,800 / $1,000,000 | 50.08% |
| Public coverage of full IC tasks | 237 / 764 | 31.02% |
| Public coverage of full manager tasks | 265 / 724 | 36.60% |

**Check:** counts and payouts close exactly.

### July 2025 revision

| Quantity | Reconstruction | Result |
|---|---:|---:|
| Original public IC tasks | — | 237 |
| Offline-verified public IC tasks | — | 198 |
| Dropped IC tasks | 237 − 198 | 39 |
| Dropped share of original public IC | 39 / 237 | 16.46% |
| Retained share | 198 / 237 | 83.54% |
| Original Diamond payout | — | $500,800 |
| Revised reported maximum payout | — | $453,800 |
| Payout-denominator decrease | $500,800 − $453,800 | $47,000 |
| Relative decrease | $47,000 / $500,800 | 9.39% |

**Boundary:** the public text does not provide the exact revised IC and manager payout denominators separately. The $47,000 difference must not be assigned to a task family without a primary-source table.

## 2. Original-paper result checks

The paper labels its Table 1 earnings as rounded to the nearest thousand. Therefore, recomputing an earn rate from the displayed dollar figure may differ slightly from the reported earn rate, which was calculated from unrounded values.

| Model / scope | Reported pass@1 | Reported earned | Reported earn rate | Arithmetic check using displayed rounded dollars | Status |
|---|---:|---:|---:|---:|---|
| GPT-4o, IC Diamond | 8.0% | $14k / $236.3k | 6.0% | 5.92% | Consistent after rounding |
| o1 high, IC Diamond | 16.5% | $29k / $236.3k | 12.1% | 12.27% | Consistent after rounding |
| Claude 3.5 Sonnet, IC Diamond | 26.2% | $58k / $236.3k | 24.5% | 24.54% | Consistent |
| GPT-4o, manager Diamond | 37.0% | $125k / $264.5k | 47.1% | 47.26% | Consistent after rounding |
| o1 high, manager Diamond | 41.5% | $137k / $264.5k | 51.8% | 51.80% | Consistent |
| Claude 3.5 Sonnet, manager Diamond | 44.9% | $150k / $264.5k | 56.8% | 56.71% | Consistent after rounding |
| GPT-4o, combined Diamond | 23.3% | $139k / $500.8k | 27.7% | 27.76% | Consistent |
| o1 high, combined Diamond | 29.7% | $166k / $500.8k | 33.1% | 33.15% | Consistent |
| Claude 3.5 Sonnet, combined Diamond | 36.1% | $208k / $500.8k | 41.5% | 41.53% | Consistent |
| GPT-4o, full | 23.3% | $304k / $1m | 30.4% | 30.40% | Exact at shown precision |
| o1 high, full | 32.9% | $380k / $1m | 38.0% | 38.00% | Exact at shown precision |
| Claude 3.5 Sonnet, full | 33.7% | $403k / $1m | 40.3% | 40.30% | Exact at shown precision |

### Exact figure available in the paper body

The paper body gives Claude 3.5 Sonnet’s combined Diamond earnings as **$208,050 out of $500,800**.

- $208,050 / $500,800 = **41.5435%**
- Rounded to one decimal place = **41.5%**, matching Table 1.

## 3. Task-composition checks

### Diamond tasks

| Nature | IC | IC share | Manager | Manager share |
|---|---:|---:|---:|---:|
| Bug fixes | 208 / 237 | 87.76% | 248 / 265 | 93.58% |
| New features/enhancements | 21 / 237 | 8.86% | 13 / 265 | 4.91% |
| Maintenance/QA/testing/reliability | 8 / 237 | 3.38% | 4 / 265 | 1.51% |

Each task-family column sums to 100%.

### Full benchmark

| Nature | IC | IC share | Manager | Manager share |
|---|---:|---:|---:|---:|
| Bug fixes | 665 / 764 | 87.04% | 667 / 724 | 92.13% |
| New features/enhancements | 68 / 764 | 8.90% | 42 / 724 | 5.80% |
| Maintenance/QA/testing/reliability | 31 / 764 | 4.06% | 15 / 724 | 2.07% |

Each task-family column sums to 100%.

## 4. Revised July 2025 result check

Official corrected result:

- benchmark version: updated 2025-07-17;
- system-card note: 2025-07-28;
- protocol: average of three pass@1 runs;
- model: post-mitigation deep research with browsing;
- scope: IC SWE tasks;
- solved rate: 53%;
- exact benchmark-credit earnings: $87,708;
- revised combined Diamond maximum payout: $453,800.

### What can and cannot be calculated

| Calculation | Result | Publication rule |
|---|---:|---|
| 53% of 198 | 104.94 task-equivalents | Do **not** call this “105 tasks solved”; the rate averages three runs. |
| $87,708 / $453,800 | 19.33% | Do **not** publish as the IC earn rate; denominator is combined Diamond while numerator is IC-only. |
| o1 earnings inferred from “nearly twice” | Not identifiable | Do not estimate or back-solve. |
| Revised IC payout denominator | Not stated in inspected primary text | Do not invent. |
| Revised manager payout denominator | Not stated in inspected primary text | Do not invent. |

## 5. Date and version matrix

| Evidence set | Result date/version | Dataset denominator | Permitted shorthand |
|---|---|---:|---|
| Original ICML/PMLR paper | February 2025 preprint / ICML 2025 publication | 1,488 full; 502 Diamond; $1m full; $500,800 Diamond | “Original paper” or “ICML 2025 results” |
| Released evaluation repository | 2025-07-17 update | 198 offline-verified public IC tasks; manager tasks separately supported | “July 2025 offline-runnable release” |
| OpenAI corrected system-card results | Updated note 2025-07-28 | $453,800 revised combined Diamond maximum | “Corrected July 2025 evaluation” |

## 6. Approved numeric claims for drafting

1. **1,488 tasks, $1,000,000 total:** exact original full benchmark.
2. **764 IC / 724 manager:** exact original task split.
3. **$414,775 IC / $585,225 manager:** exact original payout split.
4. **502 tasks, $500,800:** exact original Diamond split.
5. **237 IC + 265 manager:** exact original Diamond task split.
6. **198 retained, 39 dropped:** exact July 2025 public IC repository change.
7. **$453,800 revised maximum:** exact corrected July 2025 combined Diamond denominator.
8. **36.1% tasks and 41.5% payout:** original combined Diamond Claude 3.5 Sonnet result.
9. **33.7% tasks and 40.3% payout:** original full-set Claude 3.5 Sonnet result.
10. **53% IC solve rate and $87,708:** corrected July 2025 browsing deep-research result, explicitly IC-only and averaged over three pass@1 runs.
11. **26.15 days and 47.01 comments:** exact reported Diamond means; use “about 26 days and 47 comments” in prose.
12. **87.76% of IC Diamond tasks were bug fixes:** exact paper composition; “about 88%” is preferred for readability.

## 7. Drafting prohibitions

- Do not merge the original $500,800 denominator with the revised 53% / $87,708 result.
- Do not describe historical payout credit as real-time wages paid to the model.
- Do not convert pass rate into employee replacement probability.
- Do not call the public split half of the tasks; it is 33.74% of tasks but 50.08% of payout.
- Do not state an exact revised task count solved from the averaged 53% result.
- Do not present rounded Table 1 dollar values as exact.
- Do not generalize from Expensify/Upwork tasks to all software jobs.
- Do not omit that most benchmark tasks were bug fixes on an established codebase.
