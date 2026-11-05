# Why Did the Best Business Agent Change When Its Competitors Changed? Evidence from 100 Simulated Markets
Dr. Alaa Mohammad Ahmed

An AI agent was asked to run a simulated cereal company: set prices, plan production, buy materials and manage finance. It led the field when its competitors followed fixed rules. Put the same agent into a market where five other AI agents could alter prices and demand, and the lead disappeared. The company task stayed the same; the competitive setting did not.[1]

An **AI agent** here is a system that reads the company's state, queries tools for cash, inventory, demand and prices, and submits linked decisions over multiple rounds. **ERP — Enterprise Resource Planning** connects production, purchasing, inventory and finance in one operating system. ERPBench was designed to test whether a model-selection conclusion survives a change in who shares the market.

## Executive summary

A company can select an agent from a benchmark built around stable competitors, then discover that the ranking reverses when competitors adapt. ERPBench ran six model families through the same 100 business problems in two conditions: Solo, with five deterministic rule-based opponents, and Arena, where six evaluated AI agents competed in one market.[1]

The experiment produced 1,200 model-level trajectories and 7,200 decision rounds. DeepSeek led Solo with a mean simulated valuation of 252.29 million units. Gemini led Arena at 263.95 million. The two settings selected the same task-level winner in only 21 of 100 problems; they disagreed in 79. This does not establish a universally superior model. It shows that the test environment is part of the model-selection decision. A 10X institution should qualify agents against the competitors, constraints, shocks and execution repairs that define its own operating reality.

## What the benchmark actually ran

The simulated firm manufactured 12 cereal SKUs and sold through three distribution channels. Each problem lasted six rounds of 30 simulated days. Agents chose prices, production volumes, purchase orders, marketing allocation and finance actions. Capacity, batch size, supplier lead times, inventory, cash, credit and carbon costs constrained what could be executed.[1]

The study held problem ID, seed, difficulty, scenario, agent scaffold and horizon constant while changing opponent composition:

| Condition | Opponents | Problems | Model trajectories |
|---|---|---:|---:|
| Solo | Five deterministic policies: conservative, aggressive, balanced, growth and risk-averse | 100/100 | 600/1,200 |
| Arena | Six evaluated model agents sharing one market | 100/100 | 600/1,200 |
| Total | Six model families in two matched conditions | 200 problem-condition runs | 1,200/1,200 |

Six rounds per trajectory yielded 7,200/7,200 expected decision records. Operationally, the researchers ran 600 independent Solo simulations and 100 shared Arena markets: 700 simulator executions. Their coverage audit found 1,200/1,200 expected trajectories, zero missing records and zero duplicates.[1]

The **terminal company valuation** is a sixth-round simulation measure combining profitability, financial viability and expected future cash flows. “M” means million units on that simulated scale—not real currency or an audited company valuation.

## The headline result, then the split

| Model family | Solo mean | Arena mean | Change |
|---|---:|---:|---:|
| DeepSeek | 252.29M | 234.71M | −17.58M |
| Gemini | 169.41M | 263.95M | +94.54M |
| GPT-5.5 | 186.43M | 194.82M | +8.39M |
| Qwen | 205.87M | 187.13M | −18.74M |
| Doubao | 181.27M | 188.17M | +6.90M |
| Claude | 176.78M | 173.95M | −2.83M |

These are means across 100 problems, not success rates, so integer numerators would be inappropriate. DeepSeek's mean rank was 1.67 in Solo; Gemini's was 1.76 in Arena. Lower rank is better.[1]

At problem level, the correct-versus-opposite view is sharper:

| Question | Observed | Complement |
|---|---:|---:|
| Did both conditions choose the same winner? | 21/100 = 21% | 79/100 = 79% chose different winners |
| Did Gemini finish last in Solo? | 22/100 = 22% | 78/100 = 78% did not |
| Did Gemini finish last in Arena? | 0/100 = 0% | 100/100 = 100% did not |

Mean rank-order agreement between conditions was 0.182, with a **95% confidence interval** of 0.090 to 0.273. A confidence interval describes uncertainty in the estimate under resampling; it does not make a simulation representative of live markets.

## What happened between proposal and execution?

The simulator did not reward a plan merely for sounding plausible. It parsed each structured action, checked operational feasibility and repaired or bounded fields when necessary. The paper reports 4,557 displayed interventions:

| Execution intervention | Count/4,557 | Share |
|---|---:|---:|
| Production-capacity skip | 3,761/4,557 | 82.5% |
| Unavailable investment | 355/4,557 | 7.8% |
| Fallback decision | 275/4,557 | 6.0% |
| Production-quantity clamp | 118/4,557 | 2.6% |
| Traceback | 48/4,557 | 1.1% |

The denominator excludes five omitted run-level failures. These categories are process diagnostics, not five independent causes of valuation. A capacity skip may reveal a genuinely binding plant constraint rather than a malformed model decision. Fallbacks and tracebacks are stronger indicators of output-pipeline fragility.[1]

> ### Side evidence: average success is not reliability
> A separate preprint proposes 12 metrics spanning consistency, robustness, predictability and safety across two benchmarks. Its abstract reports 14 agentic models, while its introduction later says 15, an internal sample-count discrepancy that should not be silently resolved. The relevant point is conceptual: an average score does not show repeatability, perturbation sensitivity or failure severity.[2]

## A hypothetical operating example

This example is hypothetical and was not part of either study. A retailer tests a pricing agent across 200 products. The trial uses simulated competitors that change prices weekly, and the agent leads. In production, competitors use dynamic pricing that reacts within minutes. Demand elasticity shifts, while the retailer's agent cuts prices without jointly accounting for inventory and margin.

A stronger qualification programme would replay the same problems under fixed competitors, adaptive competitors and a supply disruption. Acceptance would require both a sound outcome and an executable path: feasible prices, available stock, margin within limits and no repeated dependence on system repairs.

## Evidence limits

- ERPBench is a preprint and a controlled ERP-inspired simulation, not a live-company deployment.
- Its evidence comes from a fixed 100-problem slice, six rounds and one six-model Arena composition.
- Neither Solo nor Arena is uniquely “correct”; each measures a different specified market.
- Service routing and model endpoints can change, so family labels are not immutable snapshots.
- Terminal valuation is simulated, not audited profit or enterprise value.
- Intervention logs qualify execution; they do not prove what caused the outcome.
- The study did not compare agents with human managers.

## Institutional decisions through the 10X lens

1. **Test the environment, not only the task.** Specify competitor, customer, supplier and constraint behavior that can alter the decision.
2. **Replay identical problems across scenarios.** Paired tests distinguish ecology effects from sample changes.
3. **Separate outcome from executability.** A high terminal score is weaker evidence when repeated repairs make decisions runnable.
4. **Measure the tail.** Track last-place frequency, stress collapse and worst-case loss, not only the mean.
5. **Set an intervention budget.** Capacity skips, fallback decisions and runtime errors should enter acceptance criteria.
6. **Inject market and supply shocks.** Add adaptive competitors, delayed supply, demand changes and cash pressure.
7. **Version the model and route.** Record provider, endpoint, configuration and date; the brand name is not enough.
8. **Begin with reversible authority.** Let the agent recommend before it can execute, then widen authority from evidence.
9. **Requalify when the ecology changes.** A new competitor or pricing regime is a reason to retest.
10. **Attach assumptions to procurement.** Ask which environment produced the leaderboard and how far it matches operations.

## Glossary

- **AI agent:** a system that reads state, uses tools and makes linked decisions toward a goal.
- **ERP:** an operating system connecting production, purchasing, inventory and finance.
- **Competitive ecology:** the composition and behavior of agents sharing the tested market.
- **Trajectory:** the record of decisions and outcomes across rounds.
- **Terminal valuation:** the company's simulated value at the sixth round.
- **Mean rank:** average position among six models; lower is better.
- **Confidence interval:** a range expressing uncertainty around an estimate.
- **Fallback decision:** a default action used when the proposed output cannot execute as written.

## Conclusion

ERPBench did not reveal one business agent that wins everywhere. It showed that “best” can change with the competitors in the test and with the repairs required to execute a decision. A single leaderboard may therefore select an advantage that exists only in the benchmark's market. Enterprise qualification should reproduce the operating ecology, vary it deliberately, and assess the path as well as the score.

## References

1. Zhang X, Lu P, Ye L, Liu P. [ERPBench: Evaluating LLM Agents for Enterprise Decision-Making Across Competitive Market Ecologies](https://arxiv.org/abs/2609.04667). arXiv:2609.04667; 4 September 2026. Primary source for design, outcomes and execution audit.
2. Rabanser S, Kapoor S, Kirgis P, Liu K, Utpala S, Narayanan A. [Towards a Science of AI Agent Reliability](https://arxiv.org/abs/2602.16666). arXiv:2602.16666; 18 February 2026. Primary source for the side-box reliability framework.
