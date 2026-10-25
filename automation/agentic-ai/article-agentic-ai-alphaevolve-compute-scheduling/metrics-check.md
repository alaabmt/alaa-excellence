# Metrics Check — AlphaEvolve Compute Scheduling

## 1. Fleet compute recovery

Published statement: average 0.7% of fleet-wide compute resources continuously recovered after deployment.

- Denominator: total Google fleet-wide compute resources during the undisclosed measurement window.
- Numerator: recovered compute resources that otherwise would have remained stranded.
- Absolute numerator: not published.
- Reconstruction possible: no.
- Confidence interval / variance: not published.
- Observation period: not published.
- Correct reading: Google reports that the deployed heuristic recovered an average share equal to 0.7 of every 100 units of fleet compute capacity.
- Incorrect reading: data-center utilization rose by 0.7 percentage points.
- Incorrect reading: costs or energy fell by 0.7%.
- Incorrect reading: an external auditor confirmed the result.

## 2. Matrix-multiplication result table

Published counts:

| Outcome | Numerator | Denominator | Reconstructed share |
|---|---:|---:|---:|
| Matched prior best | 38 | 54 | 38 ÷ 54 = 70.370…% → 70.4% |
| Surpassed prior best | 14 | 54 | 14 ÷ 54 = 25.925…% → 25.9% |
| Fell behind prior best | 2 | 54 | 2 ÷ 54 = 3.703…% → 3.7% |
| Total | 54 | 54 | 100.0% |

Checks:
- 38 + 14 + 2 = 54.
- 70.4 + 25.9 + 3.7 = 100.0 after one-decimal rounding.
- The 54 configurations are a selected technical benchmark, not a random sample of all algorithms.
- “Matched” does not mean the agent invented a new result.
- “Surpassed” means a better construction under the defined mathematical objective, not necessarily faster real software.

## 3. Highlighted 4×4 complex matrix result

- Prior rank: 49 scalar multiplications.
- AlphaEvolve rank: 48 scalar multiplications.
- Absolute reduction: 1 multiplication.
- Relative reduction in multiplication count: 1 ÷ 49 = 2.0408% → 2.04%.
- Correct reading: one exact algorithm uses 48 rather than 49 scalar multiplications for this defined operation.
- Incorrect reading: all 4×4 matrix multiplication runs 2.04% faster.
- Incorrect reading: every application gains the same end-to-end speedup.

## 4. Gemini kernel and training figures

- Input-shape split: 50% training / 50% evaluation.
- Absolute shape counts: not published; the split cannot be written as n/N.
- Mean kernel speedup: 23% over the expert-designed heuristic, as reported by Google.
- Overall Gemini training-time reduction: 1%.
- Correct reading: an optimization to one important kernel produced a larger local improvement and a smaller system-level effect.
- Incorrect reading: Gemini training became 23% faster.
- Incorrect reading: every input shape improved by 23%.
- Missing: number of kernels/shapes, distribution, confidence interval, training duration and cost.

## 5. Separate CodeEvolve comparison

- Matched or surpassed: 5.
- Selected problems: 9.
- Share: 5 ÷ 9 = 55.555…% → 55.6%.
- Not matched/surpassed under that statement: 4/9 = 44.4%.
- Correct reading: the open-source paper reports its own framework matched or exceeded AlphaEvolve's reported result on five of nine selected problems.
- Incorrect reading: an independent replication verified 55.6% of AlphaEvolve.
- Incorrect reading: the result validates Google's fleet deployment.

## 6. Publication gate

**PASS**, provided the article:
- always attaches 0.7% to fleet compute and states the missing absolute denominator;
- gives 38/54, 14/54 and 2/54 with all three outcomes visible;
- does not turn local kernel speedup into system-wide training speedup;
- isolates CodeEvolve as a separate 9-problem side study;
- labels all financial or capacity calculations outside the sources as hypothetical.
