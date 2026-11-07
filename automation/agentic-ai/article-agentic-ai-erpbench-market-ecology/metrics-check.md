# Metrics check — ERPBench market ecology

## Exact study bases
- Problems: 100 matched IDs.
- Model families: 6.
- Ecologies: 2.
- Trajectories: 100×6×2 = 1,200.
- Per ecology: 100×6 = 600.
- Rounds: 1,200×6 = 7,200.
- Simulator executions: 600 Solo + 100 shared Arena = 700.

## Outcome reconstructions
| Statement | Correct | Incorrect/opposite | Status |
|---|---:|---:|---|
| Same task-level winner across ecologies | 21/100 = 21% | 79/100 = 79% different | exact |
| Gemini last in Solo | 22/100 = 22% | 78/100 = 78% not last | exact from published rate and 100 problems |
| Gemini last in Arena | 0/100 = 0% | 100/100 = 100% not last | exact |
| Coverage | 1,200/1,200 present | 0/1,200 missing | exact author audit |

## Displayed execution interventions
Total = 3,761 + 355 + 275 + 118 + 48 = **4,557**.

| Category | Count/base | Recalculated share | Published share |
|---|---:|---:|---:|
| Capacity skips | 3,761/4,557 | 82.532% | 82.5% |
| Unavailable investment | 355/4,557 | 7.790% | 7.8% |
| Fallback decisions | 275/4,557 | 6.034% | 6.0% |
| Quantity clamping | 118/4,557 | 2.589% | 2.6% |
| Tracebacks | 48/4,557 | 1.053% | 1.1% |

Shares sum to 100.0% after the paper's one-decimal rounding. Five omitted run-level failures are outside this 4,557-event denominator.

## Mean valuations
These are means across 100 problems, not counts and not success percentages:
- DeepSeek Solo 252.29M; Arena 234.71M; change −17.58M.
- Gemini Solo 169.41M; Arena 263.95M; change +94.54M.
- GPT-5.5 186.43M→194.82M (+8.39M).
- Qwen 205.87M→187.13M (−18.74M).
- Doubao 181.27M→188.17M (+6.90M).
- Claude 176.78M→173.95M (−2.83M).

Do not attach numerators to means. Explain M as the simulator's million-unit valuation scale and not real currency or audited company value.

## Statistical terms
- q values are Benjamini–Hochberg-adjusted p-values; explain only if retained.
- Spearman correlation 0.182 with 95% bootstrap CI [0.090,0.273] is descriptive rank agreement across 100 matched problems.
- Intervention categories are non-exclusive process diagnostics and not causal decompositions.

## Publication rule
All displayed percentages must carry their base. Where the source publishes a mean, label it as a mean rather than fabricate a numerator.
