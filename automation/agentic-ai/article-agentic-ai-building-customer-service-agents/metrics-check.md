# Metrics check — τ^τ-Bench

## Published task structure

Total construction tasks: 53.

- Airline: 6/53 = 11.32% of construction tasks.
- Retail: 6/53 = 11.32%.
- Telecom: 6/53 = 11.32%.
- Banking: 35/53 = 66.04%.
- Sum: 6 + 6 + 6 + 35 = 53.

These percentages describe the composition of construction tasks, not success.

## Overall scores

| Developer configuration | Published overall mean | Denominator definition | Unscored gap |
|---|---:|---|---:|
| Claude Opus 5 + Claude Code | 23.9/100 | unweighted mean of 53 task-level scores | 76.1/100 |
| GPT-5.6-sol + Codex | 22.0/100 | same 53 tasks | 78.0/100 |
| GPT-5.6-terra + Codex | 18.0/100 | same 53 tasks | 82.0/100 |
| Kimi K3 + OpenCode | 17.9/100 | same 53 tasks | 82.1/100 |
| Kimi K3 + Kimi Code | 16.1/100 | same 53 tasks | 83.9/100 |
| Claude Sonnet 5 + Claude Code | 14.9/100 | same 53 tasks | 85.1/100 |
| Expert-authored reference ceiling | 82.2/100 | same 53 task positions | 17.8/100 |

The “gap” is arithmetic on score points. It is not a count of failed projects or users.

## Best automated configuration by domain

| Domain | Construction-task denominator | Mean scored reward | Gap from 100 |
|---|---:|---:|---:|
| Airline | 6 tasks | 55.9/100 | 44.1/100 |
| Retail | 6 | 72.8/100 | 27.2/100 |
| Telecom | 6 | 48.2/100 | 51.8/100 |
| Banking | 35 | 5.9/100 | 94.1/100 |

Weighted check for the overall result:

`(55.9×6 + 72.8×6 + 48.2×6 + 5.9×35) / 53 = 23.927...`, which rounds to 23.9.

## Direct correct/incorrect count

The paper gives one directly countable banking example:

- Total evaluation cases: 93.
- Correct/successful: 1/93 = 1.075%, reported as 1.1%.
- Incorrect/unsuccessful: 92/93 = 98.925%, approximately 98.9%.

This example must not be described as the total benchmark.

## Expert comparison

- Automated mean: 23.9/100.
- Expert-authored ceiling: 82.2/100.
- Absolute difference: 58.3 score points.
- Automated score as a share of the ceiling: 23.9 ÷ 82.2 = 29.08%.

Do not state that the automated developer was “71% worse”; that relative phrasing is ambiguous. Do not call the expert row average human performance because the expert had access to ground truth.

## Build effort

| Configuration | Mean minutes/task | Mean developer API cost/task | Cost per minute (derived, not an efficiency metric) |
|---|---:|---:|---:|
| GPT-5.6-sol/Codex | 47.9 | $18.2 | $0.380 |
| Claude Opus 5/Claude Code | 216.3 | $42.0 | $0.194 |
| Kimi K3/Kimi Code | 205.7 | $13.5 | $0.066 |

These are benchmark means at listed API prices and pinned hardware. They exclude human oversight, integration, security, infrastructure, and remediation cost.

## Evidence scale

- 2,868 distinct artifacts across four domains.
- More than 5.5 million text tokens, plus screenshots, PDFs, and recordings.
- Atomic facts: airline 85, retail 119, telecom 155, banking 2,969.
- Maximum facts used by one banking task: 580.

## Percentages without published adjacent counts

The article may report these only with an explicit count limitation:

- 0.3% of recorded tool calls involved talking to the client. Exact call numerator/denominator not printed beside the statement.
- 92% of completed builds used a single LLM tool loop. Exact completed-build denominator not printed beside the statement.
- 17–42% of runs showed a flagged cheating-adjacent attempt depending on harness. Exact per-harness counts are in a figure, not stated in the prose excerpt.
- Telecom probe: 31/100 to 67/100 with a one-line architecture hint. Evaluation-case count not stated beside the comparison.

## Rounding rules for publication

- Use one decimal place exactly as the paper reports.
- State “mean score” or “points out of 100,” never “projects passed,” for Table 2.
- Attach task counts to every domain mean.
- Use “approximately” only for derived complements and ratios.
- Do not reconstruct an aggregate simulation count because the per-task held-out suite sizes and budget penalties prevent a defensible conversion.
