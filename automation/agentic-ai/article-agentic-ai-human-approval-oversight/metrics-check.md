# Metrics check — human approval and agent oversight

## Definitions

- **False positive rate (FPR):** benign actions incorrectly blocked ÷ all benign actions in the evaluated set.
- **False negative rate (FNR):** dangerous actions incorrectly allowed ÷ all dangerous actions in the evaluated set.
- **Recall on dangerous actions:** dangerous actions correctly blocked ÷ all dangerous actions in the evaluated set; here it is approximately (1 - FNR).
- Percentages below are reported by Anthropic. Counts marked “approximate” are reconstructed from rounded percentages and denominators.

## Full-pipeline company evaluation

| Evaluation set | Total | Correct outcome | Incorrect outcome | Check |
|---|---:|---:|---:|---|
| Real internal traffic treated as benign | 10,000 | about 9,960/10,000 allowed (99.6%) | about 40/10,000 blocked (0.4% FPR) | 10,000 × 0.004 = 40 |
| Selected real overeager actions | 52 | about 43/52 blocked (about 83%) | about 9/52 allowed (17% FNR) | 52 × 0.17 = 8.84; nearest whole action ≈9; published percentage is rounded |
| Synthetic exfiltration attempts | 1,000 | 943/1,000 blocked (94.3%) | 57/1,000 allowed (5.7% FNR) | 1,000 × 0.057 = 57 |

## What cannot be reconstructed

### Permission acceptance

The source reports 93% acceptance of manual permission prompts but does not disclose:
- the total number of prompts;
- the number accepted and rejected;
- the population and time window;
- whether repeated prompts from the same users are included;
- the share of requests that were safe or unsafe.

Therefore no numerator/denominator is invented. The article must call it “93% company-reported; denominator undisclosed,” not “93 out of 100 users” and not an error rate.

### Real overeager test set

A 17% FNR on 52 actions implies approximately 8.84 missed actions. Since actions are indivisible, the likely integer is 9/52 = 17.31%, which rounds to 17%. The company does not publish the exact count, so the article must say “approximately 9 of 52,” not “exactly 9.”

## Independent side-study reconstruction

Lyell & Coiera systematic review:

| Review result | Total studies testing outcome | Evidence of automation bias | No evidence | Arithmetic |
|---|---:|---:|---:|---|
| Omission errors | 31 | 25/31 = 80.6% | 6/31 = 19.4% | 25 + 6 = 31 |
| Commission errors | 23 | 21/23 = 91.3% | 2/23 = 8.7% | 21 + 2 = 23 |

The review screened 890 records and included 40 studies; 6/40 (15.0%) were in healthcare. The omission and commission denominators overlap and must not be added together.

## Interpretation guardrails

1. “Correct” and “incorrect” are classifier outcomes within a labeled evaluation set, not overall product accuracy.
2. The 52 real actions were selected because an employee denied them or they were flagged after the fact; this is not a random sample of all tool calls.
3. The 1,000 exfiltration attempts were synthetic; they are not 1,000 observed production attacks.
4. The 10,000 real-traffic sample measures friction on presumed benign calls, not dangerous-action detection.
5. The three rows answer different questions and must never be combined into a single accuracy percentage.
6. The systematic-review percentages are shares of studies finding evidence, not shares of individual decisions that were biased.
