# Metrics check — OSWorld 2.0

## Denominators

- Benchmark: 108 tasks.
- Longest human-time bin: 17 of 108 tasks, expected human time 163–360 minutes.
- Secondary production interviews: 20 deployment teams.
- Secondary survey: 306 practitioners overall, including 86 involved in deployments; question-specific denominators vary.

## Top-line reconstruction

Top configuration reported strict completion = 20.6%.

- 108 × 0.206 = 22.248.
- Because 22.248 cannot be a raw integer task count, report **about 22 of 108 task-equivalents after rounding**, never “exactly 22 tasks.”
- Complement = 79.4%; 108 × 0.794 = 85.752, so report **about 86 of 108 non-complete task-equivalents after rounding**.
- The complement is “not strictly complete,” not “wrong”: partial work may be substantial.

Partial score = 54.8%.

- This is the share of fine-grained final-state checkpoint credit, averaged across the evaluation, not 59 of 108 completed tasks.
- Gap between partial and strict scores = 54.8 − 20.6 = 34.2 percentage points. This gap is descriptive, not a count of almost-complete tasks.

## Model/cost comparison

| Configuration | Strict | Partial | Approx. cost/task | Output tokens/task | Tool calls/task |
|---|---:|---:|---:|---:|---:|
| Claude Opus 4.8, max, batched | 20.6% | 54.8% | $72.4 | 224K | 481.8 |
| GPT-5.5, xhigh, batched | 13.0% | 49.5% | $25.5 | 37.1K | 149.8 |

- Strict completion difference: 7.6 percentage points.
- Partial-score difference: 5.3 percentage points.
- Approximate cost ratio: 72.4 / 25.5 = 2.84×.
- Token ratio: 224 / 37.1 = 6.04×.
- Do not call one universally “better”: the high-score and efficiency decisions differ.

## Exact longest-bin result

Table 21 gives 0.0% binary completion for every listed model in the longest bin (n=17). Therefore, for each configuration separately:

- Strictly complete: 0/17 = 0%.
- Not strictly complete: 17/17 = 100%.

This is the cleanest exact correct/non-complete numerator and denominator in the paper. It does not prove the models can never complete long workflows outside these 17 tasks or with different scaffolds.

## Task-composition percentages with exact counts

- Cross-source reasoning: 46/108 = 42.6%.
- Visual-spatial precision: 45/108 = 41.7%.
- Implicit-state inference: 43/108 = 39.8%.
- Multi-item state tracking: 43/108 = 39.8%.
- Conflict disambiguation: 39/108 = 36.1%.
- Dynamic environment: 10/108 = 9.3%.

Phenomena overlap; percentages must not be summed.

## Secondary context arithmetic

- 75% of 20 interviewed teams = 15/20 without formal benchmark sets (reported case-study denominator).
- The 74% human-in-loop survey result uses a question-specific deployed-system denominator; do not infer 226/306. State the reported percentage and sample frame without fabricating an integer numerator.

## Language gate

Use **strict completion**, **partial score**, **task-equivalent after rounding**, **not strictly complete**, and **controlled benchmark simulation** exactly enough to prevent confusion with general accuracy or production success.
