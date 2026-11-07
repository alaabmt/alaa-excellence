# When One Agent Never Reaches the Number: Is a Multi-Agent Workflow Worth 4.5× the Time?

Dr. Alaa Mohammad Ahmed

A scientific agent can produce a polished report that names the right methods yet never completes the calculation. Its prose may look finished even though no finite, checkable metric exists. Splitting the work among specialized agents can make that silent failure less common—but it can also multiply elapsed time. The management question is therefore not whether “more agents” sound more capable. It is whether the extra workflow reaches verifiable computation often enough to justify its operating cost.

A **multi-agent system (MAS)** coordinates several AI agents through defined roles or steps instead of assigning the entire task to one agent. ST-Bench tested that design choice on Earth-science data analysis, holding the main GPT-5 backbone constant while changing how work was organized. [1]

## What ST-Bench put under test

The researchers built 100 tasks adapted from published work in hydrology, agriculture and wetland-methane analysis, plus 11 general controls. The tasks covered 16 parts of the data-science pipeline, from data preparation and missing-value imputation to forecasting, model comparison and evaluation.

They expanded those tasks into 2,067 paper-grounded queries whose geographic, temporal or sample-size scope varied. The split was:

- 1,184/2,067 training queries (57.3%);
- 391/2,067 validation queries (18.9%);
- 492/2,067 held-out test queries (23.8%).

A **held-out test query** is excluded from training and validation, then used after the workflow has been fixed. The headline comparison used all 492 held-out queries.

Five methods generated multi-agent workflows. Each method was trained in two ways: one workflow optimized for each task, or one workflow shared across related tasks in a category. That produced ten configurations. The principal single-agent baseline and the generated systems used GPT-5 with the same maximum-token and temperature settings. The study was primarily testing workflow design rather than substituting a stronger base model.

## The score is not accuracy

ST-Bench first asked whether a run produced a **computationally realistic output**: parsable finite metrics, at least one strictly positive numeric value and no −1 failure sentinel. Passing that filter did not establish scientific truth. It established that the run had reached an admissible numerical result.

The benchmark then measured how many named scientific thresholds the result passed. Its **composite score** multiplied the realistic-output rate for each task by the average metric pass rate after realistic output existed, then summed across 100 tasks. The maximum was 100.

That definition changes how every result should be read. A score of 32/100 does not mean that 32% of queries were correct. It blends computational coverage with conditional metric quality.

## The top-line result: nine configurations above the baseline

The one-turn GPT-5 agent scored 11.0/100.

| Outcome across ten configurations | Count | Share |
|---|---:|---:|
| Composite score above the single-agent baseline | 9/10 | 90% |
| Composite score not above the baseline | 1/10 | 10% |

These are ten configurations created from five methods under two training protocols, not ten independent replications. “Above” also refers to this benchmark’s composite score, not general scientific competence.

GPTSwarm trained by category delivered the highest absolute score: 32.0/100. The paper reports a 21.1-point gain over the baseline because it used unrounded values; the displayed 32.0 and 11.0 are rounded. The displayed scores imply a 2.91× multiple, but the workflow required roughly 4.5× the inference time.

## A narrow majority of tasks improved

GPTSwarm trained separately for each task produced the highest **task win rate**—the fraction of the 100 tasks on which its composite score was strictly greater than the single agent’s.

| Comparison over 100 tasks | Count | Share |
|---|---:|---:|
| Multi-agent score was higher | 51/100 | 51% |
| Multi-agent score was not higher | 49/100 | 49% |

The second row should not be called 49 losses. The paper publishes a strict-win rate, so the remainder can include ties as well as lower scores. The split is still decision-relevant: an aggregate advantage did not translate into an advantage on every task.

## Maximum score and best efficiency were different choices

The most cost-efficient reported point was W4S trained per task. It scored 29.4/100, 18.4 points above the single agent, while using 1.85× the inference time.

| Operating choice | Composite score | Gain over 11.0 | Relative inference time | What it optimizes |
|---|---:|---:|---:|---|
| One-turn GPT-5 | 11.0/100 | — | 1.00× | Baseline |
| GPTSwarm, category-trained | 32.0/100 | +21.1 points on unrounded values | ≈4.5× | Highest absolute score |
| W4S, task-trained | 29.4/100 | +18.4 points | 1.85× | Highest gain per extra time under the paper’s formula |

There was no universal winner. A laboratory maximizing benchmark coverage would choose differently from a service operating under a deadline or compute budget.

Nor did multi-agent structure guarantee improvement. AutoAgents trained by category scored 8.2/100, below the 11.0 baseline. Its cap of five test queries per category left much of the test set unreached. Role count cannot compensate for a workflow or budget that prevents execution.

## The gain came mainly from reaching computation

Once a system had produced a computationally realistic output, conditional metric pass rates for the strongest configurations clustered at roughly 50–58%. Coverage varied much more.

In practical terms, the multi-agent advantage was not consistently better science after a valid calculation appeared. It was a greater likelihood of reaching the point where a scientific metric could be calculated at all. That distinction separates two operating problems: completion coverage and quality conditional on completion.

> **Side evidence — a separate test of the “autonomous scientist” claim**
>
> ScienceAgentBench evaluated 102 tasks drawn from 44 peer-reviewed papers in four disciplines and validated them with nine subject-matter experts. With three attempts per task, the paper reported that its best-performing condition solved 32.4% independently and 34.3% with expert-provided knowledge. An o1-preview condition reached 42.2% at more than ten times the cost of other models. These are source-reported percentages for a 102-task benchmark; the abbreviated report does not support inventing integer numerators. The study is independent context, not a replication of ST-Bench. [2]

## A hypothetical operating scenario

**This scenario is hypothetical; it was not documented in either study.**

An environmental authority needs to estimate how a drought affected several watersheds. A single agent inspects the files, describes the method and announces completion without producing the required metrics. A multi-agent workflow assigns data-quality checks, model fitting, metric comparison and terminal-state verification to separate roles.

The authority tests both designs on 100 historical, withheld analyses. Longer reports and higher confidence do not count as success. Four measures do: how many tasks reach parsable metrics, how many thresholds those metrics pass, elapsed time and total cost. If the team moves computational coverage from 30 tasks to 70 while taking five times longer, adoption depends on the value of those extra completed analyses and the deadline—not on the appeal of an “agent team.”

## Limits of the evidence

- ST-Bench is an arXiv preprint and the reported results have not been independently replicated.
- The tasks are paper-grounded but run in a controlled benchmark, not inside a live research organization.
- The 492 held-out queries support conclusions about this sample, not every scientific discipline.
- The realistic-output filter establishes numerical admissibility, not novelty, causal validity or publishable scientific truth.
- The composite score blends coverage and conditional quality; a higher value does not identify which component improved without further decomposition.
- Sharing GPT-5 controls the backbone, but the methods still differ in workflow optimization and operational budgets.
- Wall-clock ratios depend on infrastructure, and token accounting was incomplete for some adapters.
- The ten configurations are paired constructions from five methods and two protocols, not ten independent studies.
- Selecting the best workflow after examining each task group does not produce one system that dominates everywhere.
- The study did not test production safety, policy impact, organizational adoption or real scientific discovery.

## Eight institutional decisions through a 10X lens

1. **Define the execution threshold first.** Require a saved, parsable metric—not a confident completion statement.
2. **Separate coverage from conditional quality.** Report how often computation finishes, then how good the finished outputs are.
3. **Hold the backbone and test set constant.** Attribute gains to orchestration only after a paired comparison.
4. **Manage a cost-performance frontier.** Keep one option for maximum performance and another for the best gain per unit of time.
5. **Investigate the 49 non-wins.** Determine where coordination adds latency, duplication or failure without value.
6. **Demand evidence from every role.** A “review agent” should leave a test, checkpoint, file or audit record.
7. **Pilot on repeatable work.** Start with historical data and reversible decisions before any high-impact deployment.
8. **Keep scientific judgment accountable to people.** Agents may extend computational coverage; people still own interpretation, causal claims and authorization.

## Compact glossary

- **Multi-agent system (MAS):** a coordinated workflow of specialized agents.
- **Composite score:** ST-Bench’s combined measure of realistic-output coverage and conditional metric performance.
- **Computationally realistic output:** a result that passes the study’s numerical validity filter; not proof of scientific correctness.
- **Conditional pass rate:** metric performance among runs that first reached realistic output.
- **Task win rate:** share of tasks where the system’s composite score strictly exceeded the baseline.
- **Inference time:** elapsed generation time relative to the single-agent baseline.
- **Held-out query:** a case reserved for final evaluation rather than workflow development.

## Conclusion

ST-Bench found real but conditional value in multi-agent orchestration. Nine of ten configurations beat the one-agent composite score. The strongest moved from 11.0 to 32.0, but took about 4.5 times as long. A more efficient workflow reached 29.4 at 1.85 times the baseline time.

The 10X opportunity is not to multiply agents. It is to engineer a verifiable path to computation, measure coverage and quality separately, and buy additional coordination only when its marginal result is worth its marginal cost.

## Editorial notice

The views and analysis in this article are the author’s professional interpretation of the cited sources and do not necessarily represent the official positions of the organizations mentioned. Consult the original sources for complete and current information.

## References

1. Cheng Q, et al. *ST-Bench: A Spatial-Temporal Benchmark for Multi-Agent System Generation on Scientific Research Tasks*. arXiv:2610.07763v1. 6 October 2026. https://arxiv.org/html/2610.07763v1
2. Chen Z, et al. *ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery*. ICLR 2025; arXiv:2410.05080v3. https://arxiv.org/abs/2410.05080
