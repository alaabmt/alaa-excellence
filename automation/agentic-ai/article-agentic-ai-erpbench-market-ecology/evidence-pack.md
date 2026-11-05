# Evidence Pack — ERPBench market ecology

## Source A — primary paper
**Citation:** Zhang X, Lu P, Ye L, Liu P. ERPBench: Evaluating LLM Agents for Enterprise Decision-Making Across Competitive Market Ecologies. arXiv:2609.04667. 4 September 2026.
**URL:** https://arxiv.org/abs/2609.04667
**Type:** author preprint with full methods, tables and appendices.
**Confidence:** high for what the benchmark ran and reported; limited for transfer to production.

| Claim | Direct evidence | Numerator/denominator or base | Limitation |
|---|---|---|---|
| Matched design | Same 100 problem IDs under Solo and Arena | 100/100 coverage in each ecology | Fixed benchmark slice |
| Scale | Six model families × 100 problems × two ecologies | 1,200 trajectories; 600/ecology | Model endpoints may change |
| Horizon | Six rounds per trajectory | 7,200 decision rounds = 1,200×6 | Six-round horizon only |
| Simulator executions | 600 independent Solo + 100 shared Arena | 700 executions | Arena execution contains six agents |
| Solo leader | DeepSeek valuation 252.29M, rank 1.67 | Mean across 100 matched problems | Simulated terminal valuation |
| Arena leader | Gemini valuation 263.95M, rank 1.76 | Mean across 100 matched problems | One Arena composition |
| Gemini paired change | 169.41M→263.95M | +94.54M on same 100 problems | Benchmark contrast, not causal market effect |
| DeepSeek paired change | 252.29M→234.71M | −17.58M on same 100 problems | Same limitation |
| Winner agreement | Same winner on 21/100 problems | 21%; disagreement 79/100 = 79% | Task winner depends on tested ecology |
| Gemini bottom rank | 22% Solo→0% Arena | 22/100→0/100 | Model family under observed service configuration |
| Rank correlation | Mean Spearman 0.182, bootstrap CI [0.090,0.273] | 100 matched problems | Association, not accuracy |
| Displayed interventions | 3,761 capacity skips; 355 unavailable investments; 275 fallbacks; 118 clamping; 48 tracebacks | total displayed 4,557 | categories non-exclusive diagnostics; excludes five run-level failures |
| Intervention shares | 82.5%, 7.8%, 6.0%, 2.6%, 1.1% | respectively 3,761/4,557; 355/4,557; 275/4,557; 118/4,557; 48/4,557 | pooled Solo+Arena; rounding |
| Coverage audit | no duplicate and no missing model–problem records | 1,200/1,200 expected trajectories | Internal audit by authors |

## Source B — code and data repository
**URL:** https://github.com/GAIR-NLP/erp-bench
**Type:** authors' open-source repository.
**Supports:** executable benchmark description, six-round design, solo/arena modes, aggregate data and decision traces.
**Limit:** repository documentation and the paper are not independent replication.

## Source C — secondary side evidence
**Citation:** Rabanser S, Kapoor S, Kirgis P, Liu K, Utpala S, Narayanan A. Towards a Science of AI Agent Reliability. arXiv:2602.16666. 18 February 2026.
**URL:** https://arxiv.org/abs/2602.16666
**Type:** research preprint.
**Supports:** reliability should be measured beyond mean success; proposes 12 metrics across consistency, robustness, predictability and safety.
**Sample note:** abstract says 14 agentic models across two benchmarks; introduction later says 15. The side box must disclose this internal discrepancy and avoid presenting the model count as unambiguous.

## Certainty boundaries
- “The paper reports” for benchmark measurements.
- “The simulation shows” for ecology-sensitive rankings.
- Never say the study proves which model is best for a real company.
- Never treat a capacity skip as a model error automatically.
- Never infer causality from execution-intervention counts.
