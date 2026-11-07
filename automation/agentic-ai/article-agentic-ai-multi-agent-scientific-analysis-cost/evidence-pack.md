# Evidence Pack — article-agentic-ai-multi-agent-scientific-analysis-cost

Prepared: 2026-10-26 (Asia/Dubai)

## Source hierarchy

### P1 — Primary study
Qi Cheng et al. *ST-Bench: A Spatial-Temporal Benchmark for Multi-Agent System Generation on Scientific Research Tasks*. arXiv:2610.07763v1. Submitted 6 October 2026.  
Direct HTML: https://arxiv.org/html/2610.07763v1  
Type: author manuscript / primary benchmark report.  
Confidence: high for what the benchmark did and reported; external replication not established.

### P2 — Secondary study used only in a side box
Ziru Chen et al. *ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery*. ICLR 2025; arXiv:2410.05080v3.  
Direct abstract: https://arxiv.org/abs/2410.05080  
Type: peer-reviewed primary benchmark report.  
Confidence: high for its own sample; it does not validate ST-Bench.

## Claim ledger

| ID | Claim | Direct evidence | Source | Confidence | Required limitation |
|---|---|---|---|---|---|
| C1 | ST-Bench contains 100 tasks and 2,067 queries. | Dataset construction §2.2. | P1 | High | Tasks are benchmark constructions adapted from papers, not new experiments. |
| C2 | Queries split into 1,184 train, 391 validation, 492 test. | §2.2 Splits; totals equal 2,067. | P1 | High | Headline evaluation uses the 492 held-out queries. |
| C3 | Tasks span hydrology, agriculture and wetland methane, plus 11 general controls and 16 task categories. | §2.2. | P1 | High | This is Earth-science data analysis, not science as a whole. |
| C4 | Five MAS-generation methods × two training protocols = ten configurations. | §3.1 and §4.1. | P1 | High | Configurations are not ten independent model families; they share GPT-5 backbone in the main comparison. |
| C5 | Main comparison holds the backbone constant at GPT-5. | §4.1. | P1 | High | Workflow differs; full system implementations and budgets also differ by method. |
| C6 | GPT-5 one-turn baseline scored 11.0/100. | §4.2. | P1 | High | Composite score, not percentage of correct queries. |
| C7 | Nine of ten MAS configurations exceeded baseline; one did not. | Abstract and §4.2. | P1 | High | “Exceeded” refers to composite score in this benchmark. |
| C8 | Strongest configuration scored 32.0/100 vs 11.0/100, a +21.1-point gain, at about 4.5× time. | §4.2–4.3. | P1 | High | 32/100 is a composite score, not 32 successful tasks. |
| C9 | GPTSwarm per-task scored 30.3/100 and beat baseline on 51/100 tasks; did not beat it on 49/100. | §4.2–4.3; denominator is 100 tasks. | P1 | High | A task-level win can be small; the win rate is not query accuracy. |
| C10 | W4S per-task scored 29.4/100, gained +18.4 points and used 1.85× time. | §4.2–4.3. | P1 | High | “Most efficient” is under the paper’s gain-per-extra-time formula. |
| C11 | AutoAgents per-category scored 8.2/100, below baseline. | §4.2. | P1 | High | Its five-test-query-per-category cap left many queries unreached. |
| C12 | Conditional pass rates were around 50–58%; coverage varied more. | §4.2 and §4.5. | P1 | Medium-high | Range is summarized in text; exact per-method denominators are not printed in the prose. |
| C13 | A realistic output required parsable finite metrics, at least one strictly positive value and no -1 sentinel. | §3.2. | P1 | High | This is an operational filter, not scientific truth validation. |
| C14 | The absolute score multiplies realistic-output rate by mean metric pass rate per task, then sums over 100 tasks. | §3.2. | P1 | High | The score blends coverage and conditional quality; it must be explained before use. |
| C15 | ScienceAgentBench contains 102 tasks from 44 papers, four disciplines and nine experts. | P2 abstract. | P2 | High | Separate sample and older study. |
| C16 | With three attempts, its best reported condition solved 32.4% independently and 34.3% with expert knowledge; o1-preview reached 42.2% at >10× cost. | P2 abstract. | P2 | High | Percentages are reported by source; the abstract does not give integer numerators and rounding prevents exact reconstruction. Keep in side box and say “reported”. |

## Metric definitions for first use

- **MAS — Multi-Agent System — نظام متعدد الوكلاء:** several specialized AI agents coordinated in a workflow.
- **Composite score — الدرجة المركبة:** ST-Bench’s per-task realistic-output rate multiplied by conditional metric pass rate, summed across 100 tasks; maximum 100.
- **Realistic output — مخرج واقعي حسابياً:** a result passing the paper’s numeric-validity filter; it is not proof that the scientific conclusion is correct.
- **Conditional pass rate — معدل الاجتياز المشروط:** share of named scientific metric thresholds passed after a realistic output exists.
- **Task win rate — معدل الفوز على مستوى المهام:** fraction of the 100 tasks where the MAS composite score is greater than the single-agent score.
- **Inference-time ratio — نسبة زمن الاستدلال:** mean elapsed inference time relative to the one-turn single-agent baseline.
- **Held-out test query — استعلام اختبار محجوب:** a query excluded from workflow training and validation, then used for final evaluation.

## Calculations and denominator reconstruction

- Dataset split check: 1,184 + 391 + 492 = 2,067.
- Configuration comparison: 9/10 = 90%; 1/10 = 10%.
- GPTSwarm per-task: 51/100 tasks higher than baseline = 51%; 49/100 not higher = 49%.
- Strongest composite delta: 32.0 − 11.0 = 21.0 from displayed rounded scores, while the paper reports +21.1 from unrounded values. Use the reported +21.1 and disclose rounded display values.
- W4S delta: 29.4 − 11.0 = 18.4 points, matching the paper.
- Strongest relative multiple of displayed composite: 32.0 / 11.0 = 2.91×. Do not call this “accuracy”.
- W4S relative multiple of displayed composite: 29.4 / 11.0 = 2.67×.
- ScienceAgentBench source percentages cannot be converted to exact integer numerators without guessing because 32.4%, 34.3% and 42.2% are rounded and the evaluation allows three attempts. Keep them as source-reported percentages with n=102 tasks, not invented fractions.

## Evidence boundaries

1. arXiv v1 is a preprint; no independent replication is cited.
2. Benchmark tasks are adapted from published studies but executed in a controlled environment.
3. Main results use 492 held-out query instances across 100 tasks, not production science teams.
4. The verifier tests numerical validity, thresholds and proximity to cached references; it cannot establish novelty, causal truth or publishable scientific discovery.
5. “Realistic” means numerically admissible under a filter, not scientifically correct.
6. The score is composite and can rise because more queries reach computation even if conditional metric quality barely changes.
7. Methods use different workflow optimizers and operational budgets; sharing GPT-5 controls the backbone but not every system detail.
8. Wall-clock ratios are environment-dependent; token accounting is incomplete for some adapters.
9. The ten configurations are paired constructions from five methods and two training protocols, not ten independent replications.
10. Tag-level “best MAS” rows select the best configuration post hoc for each group and must not be presented as one deployable universal system.
11. No production safety, organizational adoption, peer-review output or real-world research impact was tested.
12. ScienceAgentBench is contextual evidence only and must remain in a separate, labeled side box.

## Editorial decision rules

- Say “composite score,” never “accuracy,” for 11.0/100, 29.4/100 or 32.0/100.
- Present the overall 9/10 vs 1/10 before named configurations.
- Give 51/100 and 49/100 for the one clean task-level correct/wrong-style split, while explaining that “win” means higher composite score.
- Separate benchmark simulation from production scientific work.
- Label the institutional deployment scenario hypothetical.
- Attribute source claims explicitly: “the paper reports,” unless the number is arithmetically reconstructed above.
