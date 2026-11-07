# Metrics check — article-agentic-ai-multi-agent-scientific-analysis-cost

Checked: 2026-10-26 (Asia/Dubai)

## Dataset arithmetic

| Item | Numerator / components | Denominator / total | Check |
|---|---:|---:|---|
| Train queries | 1,184 | 2,067 | Source-reported |
| Validation queries | 391 | 2,067 | Source-reported |
| Held-out test queries | 492 | 2,067 | Source-reported |
| Sum | 1,184 + 391 + 492 = 2,067 | 2,067 | PASS |
| Tasks | 100 | 100 | Source-reported |
| Task categories | 16 | — | Source-reported |
| MAS configurations | 5 methods × 2 protocols = 10 | 10 | PASS |

Computed query shares, for internal checking only:
- Train: 1,184 / 2,067 = 57.281% → 57.3%.
- Validation: 391 / 2,067 = 18.916% → 18.9%.
- Test: 492 / 2,067 = 23.803% → 23.8%.
- Rounded shares sum to 100.0%.

## Overall configuration outcome

- Above single-agent baseline: 9 / 10 = 90%.
- Not above baseline: 1 / 10 = 10%.
- The failed-to-beat-baseline configuration is AutoAgents per-category: 8.2/100 versus 11.0/100.

## Score and cost checks

| Configuration | Composite score | Displayed difference vs 11.0 | Paper-reported gain | Time ratio | Interpretation |
|---|---:|---:|---:|---:|---|
| GPT-5 one-turn | 11.0/100 | — | — | 1.00× | Reference |
| GPTSwarm per-category | 32.0/100 | +21.0 | +21.1 pp | ≈4.5× | Strongest absolute score |
| GPTSwarm per-task | 30.3/100 | +19.3 | not needed in article | ≈4.5× | Highest task win rate |
| W4S per-task | 29.4/100 | +18.4 | +18.4 pp | 1.85× | Highest reported gain per extra time |
| AFlow per-task | 26.6/100 | +15.6 | not needed | not needed | Next-efficient |
| W4S per-category | 26.0/100 | +15.0 | not needed | not needed | Top-five absolute score |
| AutoAgents per-category | 8.2/100 | −2.8 | negative | — | Below baseline |

The 0.1-point mismatch for GPTSwarm results from rounded displayed scores; use the paper’s +21.1-point gain and note that 32.0 and 11.0 are rounded.

Relative score multiples from displayed values:
- 32.0 / 11.0 = 2.909 → 2.91×.
- 29.4 / 11.0 = 2.673 → 2.67×.
These are multiples of a composite benchmark score, not accuracy ratios.

## Task-level win split

GPTSwarm per-task:
- Higher composite score than baseline: 51 / 100 tasks = 51%.
- Not higher: 49 / 100 tasks = 49%.

“Not higher” combines ties and losses because the source reports only the strict-win fraction. The article must not relabel all 49 as losses.

## Conditional-quality range

The paper reports conditional metric pass rates around 50–58% after a realistic output exists. No exact integer numerators are available in the prose, so the article will report the range without invented counts and will state that it is conditional on passing the realistic-output filter.

## Secondary-study percentages

ScienceAgentBench uses 102 tasks and three attempts:
- 32.4%, 34.3%, and 42.2% are source-reported rounded percentages.
- 102 × 0.324 = 33.048; 102 × 0.343 = 34.986; 102 × 0.422 = 43.044.
Because these do not map uniquely to integer task counts under a multi-attempt evaluation, no numerator will be invented. Each percentage will be labeled “reported, n=102 tasks.”

## Final metric gate

**PASS**, subject to four wording controls:
1. 11.0, 29.4 and 32.0 are composite scores, not accuracy.
2. 51/100 are strict task-level wins; 49/100 are “not higher,” not necessarily all losses.
3. The 9/10 result concerns configurations, not independent replications.
4. Simulation and production science remain explicitly separated.
