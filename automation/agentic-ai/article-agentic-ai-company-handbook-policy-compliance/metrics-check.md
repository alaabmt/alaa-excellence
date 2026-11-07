# Metrics check — article-agentic-ai-company-handbook-policy-compliance

## Evaluation denominator

The paper evaluates each model configuration on 65 tasks with four trials per task:

`65 × 4 = 260 trials per configuration`.

Strict pass@1 is the proportion of those trial outcomes in which every rubric criterion passed. It is not a percentage of 65 unique tasks, a mean criterion score, or general accuracy.

## Reconstructed strict outcomes

| Configuration/result | Reported | Reconstructed pass numerator | Reconstructed fail numerator | Denominator | Check |
|---|---:|---:|---:|---:|---|
| Claude Fable 5 adaptive/max | 36.2% | 94 | 166 | 260 | 94/260 = 36.153846%; 166/260 = 63.846154% |
| Claude Fable 5 default | 34.2% | 89 | 171 | 260 | 89/260 = 34.230769%; 171/260 = 65.769231% |
| GPT-5.6 Sol max | 23.5% | 61 | 199 | 260 | 61/260 = 23.461538%; 199/260 = 76.538462% |

The one-decimal rounding windows contain only these integer numerators because one trial changes the rate by 100/260 = 0.384615 percentage points. Therefore the integer reconstruction is unique, while still not a raw count printed in the paper.

## Benchmark composition

| Component | Numerator | Denominator | Recalculation |
|---|---:|---:|---:|
| Expected-Output criteria | 592 | 824 | 71.844660% → 71.8% |
| Incorrect-Behavior criteria | 232 | 824 | 28.155340% → 28.2% |
| Finance tasks | 12 | 65 | 18.461538% |
| HR tasks | 13 | 65 | 20.000000% |
| Insurance tasks | 13 | 65 | 20.000000% |
| Logistics tasks | 12 | 65 | 18.461538% |
| Medical-billing tasks | 15 | 65 | 23.076923% |

Domain percentages are not needed in the article; show task counts to avoid implying domain-weighted performance.

## Strict versus near-miss

The paper reports approximate N−1 values, including Opus max rising from 21.9% to roughly 46%. Because “roughly 46%” is approximate and the chart rather than a raw-count table supplies it:

- Do not derive an integer numerator.
- Describe it as “about 46%”.
- Explain that N−1 permits exactly one failed criterion.
- Do not present it as acceptable production compliance.

## Rounded production-survey percentages

The MAP side study reports 68% and 74% over practitioner responses, but the public paper page does not publish question-specific raw numerators. The nominal survey size is 86, yet response counts can vary by question. Therefore:

- retain the source-reported percentages;
- state the overall survey sample of 86 practitioners and 20 interviews;
- do not write 58/86 or 64/86;
- do not combine these percentages with the 65-task benchmark.

## Correct/incorrect language

- “Strictly passed”: all criteria in a trial passed.
- “Failed strict grading”: one or more criteria failed.
- A strict failure is not necessarily wholly wrong; it may be a near miss.
- “Incorrect-Behavior criterion” is the study’s rubric category for a prohibited action. It is not the count of failed tasks.
- Do not call 36.2% “accuracy”.
- Do not generalize from the selected simulation to production reliability.

## Publishable sequence

1. Overall benchmark: 65 tasks, 260 trials per configuration, 824 checks.
2. Domain split: 12 + 13 + 13 + 12 + 15 = 65.
3. Rubric split: 592/824 required-output, 232/824 prohibited-behavior.
4. Strict outcome for the leader: reconstructed 94/260 pass, 166/260 fail.
5. Comparison: 89/260, 61/260 for the next selected configurations.
6. Near-miss metric: approximate only, with no invented numerator.
