# Evidence Pack — AlphaEvolve Compute Scheduling

## Scope

This pack covers the data-center scheduling story as the primary narrative. Mathematical and kernel results are supporting evidence only. Confidence labels reflect the quality and independence of the public evidence, not the importance of the claim.

| Claim | Number / result | Direct source | Source type | Confidence | Evidence limit |
|---|---:|---|---|---|---|
| AlphaEvolve is an evolutionary coding agent that uses language models to generate and refine executable programs under automated evaluation. | Architecture, no single performance number | Novikov et al., arXiv:2506.13131v1, §§1–2 | Developer-authored technical report | High for system description | Full agent code and exact prompts are not public. |
| The scheduling problem was represented as vector bin packing with CPU and memory dimensions. | 2 resource variables | Technical report, §3.3.1 | Developer-authored technical report | High | The public paper does not disclose all production constraints or Borg objectives. |
| The evolved rule ranked machines already judged eligible and capable by Borg. | Eligibility gate before heuristic rank | Technical report, §3.3.1 | Developer-authored technical report | High | “Correct by construction” applies to eligibility, not to globally optimal scheduling or every operational outcome. |
| Historical workload and capacity snapshots drove the simulator; a recent unseen set tested generalization. | Train/test chronology stated; sample counts absent | Technical report, §3.3.1 | Developer-authored technical report | Medium-high | No snapshot count, time window, distribution, variance or statistical interval is published. |
| Google deployed the evolved scheduling heuristic across its fleet. | Fleet-wide rollout | Technical report, §3.3.1; DeepMind blog, 14 May 2025 | Company technical report and company article | Medium-high | No independent confirmation or audit is cited. |
| Post-deployment measurements reported continuous average recovery of fleet compute that would otherwise be stranded. | 0.7% of fleet-wide compute resources | Technical report, §3.3.1 | Company-reported production measurement | Medium | Fleet size, absolute numerator, observation period, uncertainty, cost and energy consequences are undisclosed. |
| AlphaEvolve's scheduling rule was preferred to deep reinforcement learning for performance plus interpretability, debuggability, predictability and ease of deployment. | Qualitative comparison | Technical report, §3.3.1 | Company engineering judgment | Medium | No head-to-head numeric table is provided for this choice. |
| The matrix-multiplication table evaluates 54 configurations. | 54 total | Technical report, Appendix A, Table 3 | Technical report with exact constructions | High | This is a computational/mathematical benchmark, not a production workload. |
| AlphaEvolve matched the prior best result. | 38/54 = 70.4% | Technical report, Table 3 | Technical report | High | The denominator is a researcher-selected set of targets. |
| AlphaEvolve surpassed the prior best result. | 14/54 = 25.9% | Technical report, Table 3 | Technical report plus public verification notebook for improvements | High for published constructions | Repository contains improved cases, not the full agent or matched cases. |
| AlphaEvolve fell behind the prior best result. | 2/54 = 3.7% | Technical report, Table 3 | Technical report | High | Do not hide this group when summarizing performance. |
| The category arithmetic is complete. | 38 + 14 + 2 = 54; 70.4% + 25.9% + 3.7% = 100.0% after rounding | Reconstruction from Table 3 | Derived arithmetic | High | Rounded to one decimal place. |
| For 4×4 complex-valued matrix multiplication, the reported rank improved from 49 to 48 scalar multiplications. | 49 → 48; reduction 1/49 = 2.04% in multiplication count | Technical report abstract and Table 3; public result notebook | Technical report + verification artifact | High for the specific construction | This does not imply a 2.04% end-to-end application speedup. |
| The kernel experiment split realistic input shapes evenly between training and evaluation. | 50% / 50%; absolute counts missing | Technical report, §3.3.2 | Developer-authored technical report | Medium-high | No numerator or denominator is disclosed; only the split is known. |
| The evolved tiling heuristic produced a reported mean kernel speedup and smaller overall training-time reduction. | 23% mean kernel speedup; 1% overall Gemini training-time reduction | Technical report, §3.3.2 | Company production result | Medium | Number of kernels/input shapes, dispersion, baseline duration and cost are undisclosed. |
| CodeEvolve matched or surpassed reported AlphaEvolve results on a selected benchmark subset. | 5/9 = 55.6% | Assumpção et al., arXiv:2510.14150 | Separate open-source research paper | Medium | Nine selected problems; not an audit of Google infrastructure or the 0.7% result. |

## Primary sources

1. Novikov A, Vũ N, Eisenberger M, et al. **AlphaEvolve: A coding agent for scientific and algorithmic discovery.** arXiv:2506.13131v1. 16 June 2025.  
   https://arxiv.org/abs/2506.13131  
   Supports architecture, scheduling method, production claim, kernel experiment and matrix table.

2. Google DeepMind. **AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms.** 14 May 2025.  
   https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/  
   Supports the institution's public framing; not independent evidence.

3. Google DeepMind. **Results of AlphaEvolve.**  
   https://github.com/google-deepmind/alphaevolve_results  
   Provides a public notebook and verification code for improved mathematical constructions. Explicitly excludes the code to run AlphaEvolve and matched-only results.

4. Assumpção H, Ferreira D, Campos L, Murai F. **CodeEvolve: an open-source evolutionary framework for algorithmic discovery and optimization.** arXiv:2510.14150.  
   https://arxiv.org/abs/2510.14150  
   Used only in a separate side box with the 9-problem sample stated.

## Evidence classification

- **Production reality:** fleet deployment and post-deployment 0.7% claim.
- **Simulation:** historical-snapshot simulator used before rollout.
- **Exact computational construction:** matrix algorithms and verification notebook.
- **Company claim:** Google-scale operational figures without independent audit.
- **Separate study:** CodeEvolve 5/9 benchmark comparison.
- **Not established:** cash savings, energy savings, emissions reductions, return on investment, performance at another organization, or universal superiority of evolutionary agents.
