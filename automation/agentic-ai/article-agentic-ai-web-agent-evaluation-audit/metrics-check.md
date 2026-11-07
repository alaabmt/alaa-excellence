# Metrics check — article-agentic-ai-web-agent-evaluation-audit

## Denominator rule
Primary denominator is **165 task runs per condition**. “Correct” means verified task completion under the paper's audit rules; it is not general model accuracy. Failure-mode shares use **102 verified failed runs**. Progress-subset shares use their explicitly stated subset denominators.

## Arithmetic audit

| Metric | Published | Fraction check | Complement / interpretation | Status |
|---|---:|---:|---:|---|
| Raw success, strongest GPT-5.5 condition | 30.91% | 51/165 = 30.909% | Raw failure 114/165 = 69.091% | PASS |
| Corrected success, strongest condition | 38.18% | 63/165 = 38.182% | Verified failure 102/165 = 61.818% | PASS |
| Recovered false negatives | +7.27 pp | 12/165 = 7.273% | 12 of the 114 raw failures were corrected; 102 remained failures | PASS |
| MASM-only corrected, 25 steps | 34.55% | 57/165 = 34.545% | Failure 108/165 = 65.455% | PASS |
| Guide + MASM net change, 25 steps | +3.64 pp | (63−57)/165 = 6/165 = 3.636% | 20 gains − 14 regressions = net +6 | PASS |
| Tasks that flipped outcome | 20.61% | 34/165 = 20.606% | 20 Guide-only + 14 MASM-only | PASS |
| Scroll oscillation among failures | 31.4% | 32/102 = 31.373% | 70/102 were other failure modes | PASS |
| Unfinished exploration | 12.7% | 13/102 = 12.745% | – | PASS |
| Premature answer | 12.7% | 13/102 = 12.745% | – | PASS |
| Invalid action format | 8.8% | 9/102 = 8.824% | – | PASS |
| Incomplete form/edit | 7.8% | 8/102 = 7.843% | – | PASS |
| Other failure modes grouped for article | 26.5% | 27/102 = 26.471% | Sum check: 32+13+13+9+8+27=102 | PASS |
| Structured progress extractable | 55.2% | 91/165 = 55.152% | Not available/usable for 74/165 = 44.848% | PASS |
| Failed runs self-reporting ≥80% | 17.6% | 18/102 = 17.647% | 84/102 below 80% or no such report | PASS |
| Failed runs self-reporting 100% | 6.9% | 7/102 = 6.863% | Self-report, not verified completion | PASS |
| Action-limit failures verified ≥80% | 20.0% | 8/40 = 20.0% | 32/40 below 80% | PASS |
| Action-limit failures verified 100% | 0.0% | 0/40 = 0% | 40/40 below complete | PASS |
| Guide available at 15 steps, MASM | 37.06% | 53/143 = 37.063% | Failure 90/143 | PASS |
| Guide available, Guide+MASM | 39.16% | 56/143 = 39.161% | Failure 87/143 | PASS |
| No guide, either condition | 22.73% | 5/22 = 22.727% | Failure 17/22 | PASS |
| Qwen raw without MASM | 13.90% | 23/165 = 13.939% | Paper displays 13.90%; arithmetic from counts is 13.94%. Preserve count and source-reported percentage, flag discrepancy. | FLAG |
| Qwen raw with MASM | 18.80% | 31/165 = 18.788% | Rounds to 18.79%, not 18.80 under conventional two-decimal rounding; preserve count and source value, flag. | FLAG |

## Metric types that are not proportions
- Mean maximum verified progress 56.2% is a mean across 40 analyzable action-limit failures, not 22.48/40 “successes.” It must not be converted into a count.
- Mean actions 15.0 vs 8.9 and median 14 vs 7 apply only to 20 Guide-only success pairs.
- p=.392 is an exact paired-test probability under the authors' test, not a success rate.
- Percentage-point differences are absolute differences between rates, not relative percentage improvements.

## Article display order
1. Total: 165 tasks in the condition.
2. Automatic split: 51 accepted / 114 rejected.
3. Human-audited split: 63 verified complete / 102 verified failed.
4. Reclassification: 12 of 114 raw failures recovered as evaluator false negatives.
5. Failure breakdown: counts over 102, with every percentage showing n/102.
6. Intervention comparison: 57/165 vs 63/165; then paired flips 20 vs 14, total 34/165.
7. Progress evidence: each subset denominator stated.

## Publication rule
Do not print the Qwen source percentages without the counts and arithmetic note. To avoid distracting the main story, keep Qwen in a compact methods note or omit its percentages from the public article while retaining them in the Evidence Pack.
