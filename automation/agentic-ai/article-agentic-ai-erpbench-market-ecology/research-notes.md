# Research notes — ERPBench market ecology

## Candidate
- **Primary study:** Xinran Zhang, Pengrui Lu, Lyumanshan Ye, Pengfei Liu. “ERPBench: Evaluating LLM Agents for Enterprise Decision-Making Across Competitive Market Ecologies.” arXiv:2609.04667, 4 September 2026.
- **Direct paper:** https://arxiv.org/abs/2609.04667
- **Code/data:** https://github.com/GAIR-NLP/erp-bench
- **Status:** preprint; controlled ERP-inspired simulation, not a live enterprise deployment.

## Concrete opening problem
A purchasing-and-pricing agent can appear best when competitors follow fixed rules, yet lose its lead when competitors adapt. Selecting an enterprise agent from one leaderboard can therefore encode the wrong market assumption.

## What the researchers did
- Simulated a cereal manufacturer over six rounds of 30 simulated days.
- Agent decisions covered prices, production, procurement, marketing and finance for 12 SKUs in three channels.
- Evaluated the same 100 problems in two matched ecologies:
  - Solo: each evaluated model competes with five deterministic rule-based opponents.
  - Arena: six evaluated LLM agents share one market.
- Six model families, 600 model-problem trajectories per ecology, 1,200 total trajectories and 7,200 decision rounds.
- Recorded executable-path interventions such as capacity skips, unavailable investments, fallbacks, clamping and tracebacks.

## Central findings
- Solo leader: DeepSeek, mean valuation 252.29M, mean rank 1.67.
- Arena leader: Gemini, mean valuation 263.95M, mean rank 1.76.
- Gemini changed from 169.41M to 263.95M (+94.54M); DeepSeek from 252.29M to 234.71M (-17.58M).
- Same task-level winner in only 21/100 problems; different winner in 79/100.
- Gemini bottom-rank rate: 22/100 in Solo versus 0/100 in Arena.
- Logged displayed interventions total 4,557: 3,761 capacity skips, 355 unavailable investments, 275 fallbacks, 118 clamping events, 48 tracebacks. Five omitted run-level failures are not included in these shares.

## Editorial angle
Model selection is a test-design decision. A leaderboard is valid only for the market ecology, operational constraints and execution repairs it actually tests.

## Secondary side evidence
“Towards a Science of AI Agent Reliability,” arXiv:2602.16666. The abstract reports 14 agentic models across two benchmarks and 12 reliability metrics; the introduction later says 15 models. Present this internal count discrepancy explicitly if used.

## Limits
- Preprint and simulated market.
- Fixed 100-problem slice, six rounds and one Arena composition.
- Model endpoints and service routing can change.
- Interventions are diagnostics, not causal explanations.
- Terminal valuation is a simulated DDM-based outcome, not audited company value.
