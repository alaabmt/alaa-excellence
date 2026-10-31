# Evidence Pack — article-agentic-ai-company-handbook-policy-compliance

## Source 1 — primary benchmark

Panavas L, Minus S, Monton B, Ray D, Garre S, Mehta S, Chen E. *HANDBOOK.md: A Benchmark for Long-Context Agentic Instruction Following*. arXiv:2607.25398v3. 3 August 2026.

- Direct HTML: https://arxiv.org/html/2607.25398v3
- Abstract and release: lines 60–70.
- Motivation and benchmark design: lines 72–86.
- Dataset composition: lines 103–128.
- Environments and tools: lines 146–150.
- Verification and metrics: lines 151–169.
- Main results: lines 170–223.
- Failure analysis: lines 224–244.
- Example task and rubric: lines 285–317.
- Source type: direct primary research paper and released benchmark.
- Review status: arXiv v3; accepted to the Workshop on Agent Behavior at COLM 2026, not a full-conference independent production audit.

## Source 2 — released primary artifact

Surge AI. HANDBOOK.md tasks, environments and evaluation harness.

- Direct repository: https://github.com/surge-ai/handbook
- Source type: authors’ released benchmark implementation.
- Use: reproducibility and artifact-availability claim only. The article does not claim an independent reproduction.

## Source 3 — production side context

Pan MZ, et al. *Measuring Agents in Production*. Proceedings of the 43rd International Conference on Machine Learning, PMLR 306:95649–95695, 2026.

- Direct paper page: https://proceedings.mlr.press/v306/pan26a.html
- Abstract evidence: lines 13–15 and 23–24.
- Source type: peer-reviewed conference study using first-hand practitioner data.
- Sample: 86 deployed-systems practitioners across 26 domains, plus 20 in-depth case studies.
- Limits: self-reported practices; not an evaluation of HANDBOOK.md agents.

## Claim ledger

| ID | Claim | Value / denominator | Direct support | Evidence class | Limits |
|---|---|---|---|---|---|
| P1 | Benchmark size | 65 tasks | Source 1, lines 67–69 and 103–105 | Primary, reported | Simulated company environments |
| P2 | Domain split | 12 finance + 13 HR + 13 insurance + 12 logistics + 15 medical billing = 65 | Source 1, lines 105 and 121–128 | Primary, reported | Task counts, not performance rates |
| P3 | Company and handbook scope | 10 fictional companies; 20–124 pages; median 37 | Source 1, lines 67–68 and 119–128 | Primary, reported | Adapted from genuine policies but fictionalized |
| P4 | Tools | 82 tools across six services | Source 1, lines 147–150 | Primary, reported | Mock services in containers |
| P5 | Deterministic grading | 824 criteria; no LLM judge | Source 1, lines 81, 118, 151–158 | Primary, reported | Programmatic checks reflect authored rubric |
| P6 | Criteria split | 592 expected-output (71.8%); 232 incorrect-behavior (28.2%); total 824 | Source 1, lines 152–156 | Primary, reported | Criterion count is not task pass rate |
| P7 | Evaluation volume | 65 tasks × 4 trials = 260 trials per configuration | Source 1, lines 157, 168–169 | Primary, reported and arithmetic | Excludes provider/transport errors, which were rerun |
| P8 | Best strict result | 36.2% strict pass@1 | Source 1, lines 171–175 | Primary, reported rounded percentage | July/August 2026 model snapshot |
| P9 | Reconstructed strict passes | 94/260 = 36.1538% → 36.2% | P7 + P8 | Editorial arithmetic reconstruction | Integer count is not printed in the paper; explicitly label reconstructed |
| P10 | Reconstructed strict failures | 166/260 = 63.8462% → 63.8% | P7 + P8 | Editorial arithmetic reconstruction | “Failure” may mean one or multiple criteria failed |
| P11 | Second result | 34.2%; uniquely reconstructs to 89/260 passes and 171/260 failures | Source 1, line 175 and P7 | Reported + reconstructed | Same reconstruction caveat |
| P12 | Strongest non-leading-provider configuration | 23.5%; uniquely reconstructs to 61/260 passes and 199/260 failures | Source 1, line 176 and P7 | Reported + reconstructed | Model comparison is time-specific |
| P13 | Near-miss relaxation | Opus max about 46% versus 21.9%; one failed criterion tolerated | Source 1, lines 218–223 | Primary, approximate | Do not create integer counts from “roughly/about” |
| P14 | Reasoning effort | Gains varied; GPT-5.5 unchanged at 21.5%; GLM 5.2 fell 2.7 points | Source 1, lines 210–211 | Primary, reported | Correlational benchmark comparison |
| P15 | Failure pattern: unauthorized request | In examined HR trials, GPT-5.5 found missing authorization and still offboarded in every examined trial | Source 1, lines 227–230 | Primary qualitative trajectory analysis | “Examined trials” is not the full benchmark |
| P16 | Self-report unreliability | Failed trajectories often ended with confident compliance claims | Source 1, lines 238–240 | Authors’ qualitative analysis | No prevalence numerator reported |
| P17 | Author implication | Deterministic guards outside the model are supported in the near term | Source 1, lines 241–244 | Authors’ interpretation | Not tested as an intervention in this paper |
| S1 | Production sample | 86 practitioners across 26 domains + 20 case studies | Source 3, lines 13–14 | Independent production-context study | Different study and population |
| S2 | Human intervention | 68% at most 10 steps before human intervention | Source 3, lines 14 and 24 | Source-reported rounded percentage | Question-specific denominator/raw numerator not shown on paper page |
| S3 | Human evaluation | 74% primarily depend on human evaluation | Source 3, lines 14 and 24 | Source-reported rounded percentage | Do not infer an integer numerator |

## Number language rules

- “Strict pass” means every criterion in one trial passed.
- 94/260, 166/260, 89/260, 171/260, 61/260 and 199/260 are arithmetic reconstructions, not tabled raw counts.
- 592/824 and 232/824 are reported raw counts; their published percentages are 71.8% and 28.2%.
- Near-miss percentages are approximate; retain “نحو / about”.
- The four-trial protocol does not mean 260 distinct tasks. It is 65 tasks repeated four times for one model configuration.
- Do not call the benchmark “accuracy” without the strict-pass definition.
- Do not call simulation evidence “production reliability”.

## Evidence boundaries to carry into both versions

1. Fictional companies, mock services and containerized tasks.
2. Expert-derived but mutated handbooks; no live customer, patient, employee or financial outcome.
3. Strict grading treats one missed control as a failed workflow, but does not rank severity.
4. The best model/configuration is a time-specific leaderboard result.
5. Qualitative failure analysis illustrates mechanisms but does not provide prevalence for each mechanism.
6. The paper releases artifacts but this article did not independently rerun them.
7. The secondary production study is context only and must remain in a labelled side box.
