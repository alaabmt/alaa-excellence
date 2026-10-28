# When an Agent Does Half the Work but Finishes Only One Task in Five

Dr. Alaa Mohammad Ahmed

An AI agent can find the receipts, open the expense portal, populate most fields and still submit the wrong claim. One late email may change the amount. One missing attachment may invalidate the package. A dashboard full of successful actions does not mean the workflow reached a usable end state. OSWorld 2.0 measured that gap: its strongest tested setup earned 54.8% of partial credit but achieved strict end-to-end completion on only 20.6% of the controlled benchmark. [1]

A **computer-use agent** is an AI system that reads interfaces and operates software—clicking, typing, opening files and invoking tools—to pursue a multi-step goal. Its hardest job is often not the next click. It is maintaining the whole task state as evidence moves across email, documents and business systems, and as that state changes while the work is underway.

## A benchmark built around complete workflows

The OSWorld 2.0 team created 108 long-horizon tasks spanning seven professional domains and 21 subcategories. The environment combined desktop applications with 31 self-hosted web services that stood in for email, banking, team chat and business portals. A task could require evidence from a receipt, a bank record, an earlier report and a message arriving midway through execution. [1]

A skilled human needed a median of about 1.6 hours. The paper estimates that 69.6% of the 108 tasks take a human more than an hour, but it does not publish a raw integer numerator for that rounded percentage. Each task was scored against fine-grained final-state checks—27.25 on average—so the benchmark could distinguish meaningful progress from a fully correct outcome. [1]

This was not live production. The services were controlled replicas, artifacts were collected or adapted from realistic materials, and a simulated user answered bounded clarification questions. Human annotators re-solved the tasks and audited scoring, but the model results remain evidence from a benchmark simulation.

## Two scores that answer different questions

**Strict binary completion** means every required final-state check passed. Missing one mandatory document or failing to resolve one amount conflict leaves the task incomplete.

**Partial score** awards credit across the individual checkpoints. It captures useful progress, but it is not the percentage of tasks finished.

At a budget of up to 500 steps, Claude Opus 4.8 with maximum reasoning effort and batched actions produced the strongest reported result.

| Outcome measure | Reported result | What the denominator means |
|---|---:|---|
| Strict completion | 20.6% | Aggregate result across the 108-task benchmark |
| Partial score | 54.8% | Average checkpoint credit, not completed tasks |
| Gap | 34.2 percentage points | Progress that did not become full completion |

The paper does not expose an integer numerator for the rounded 20.6% aggregate. Multiplying by 108 gives roughly 22 completed-task equivalents and roughly 86 non-completed-task equivalents. Those are reader aids after rounding, not published raw counts. “Not completed” also does not mean “entirely wrong”; a run may have completed substantial work before missing a decisive final condition.

## The performance leader was not the efficiency leader

GPT-5.5 reached 13.0% strict completion and a 49.5% partial score. It averaged 37.1K output tokens at an estimated $25.5 per task. The top Opus configuration used 224K output tokens and cost about $72.4 per task. [1]

| Operating choice | Strict completion | Partial score | Estimated cost/task | Output tokens/task |
|---|---:|---:|---:|---:|
| Highest score: Opus 4.8 | 20.6% across 108 tasks | 54.8% | $72.4 | 224K |
| Greater token efficiency: GPT-5.5 | 13.0% across 108 tasks | 49.5% | $25.5 | 37.1K |

The higher-scoring setup cost about 2.84 times as much and generated 6.04 times as many output tokens for a 7.6-point strict-completion advantage and a 5.3-point partial-score advantage. Those costs are estimates tied to model pricing at the time of the study. They are not durable enterprise operating costs.

## The longest 17 tasks: an exact numerator

The most concrete breakdown appears in the longest human-time band. It contained 17 tasks estimated to require 163–360 minutes of human work. For every one of the four model configurations in that comparison:

| Final-state judgment | Numerator and denominator | Rate |
|---|---:|---:|
| Fully completed | 0 of 17 | 0% |
| Not fully completed | 17 of 17 | 100% |

That is accuracy within a selected subgroup, not a general performance rate for computer agents. Different tasks, scaffolds, memory systems or models could produce a different result.

## Why visible progress failed to become completion

The agents often handled local actions well. The breakdown occurred at task level: they dropped earlier constraints, missed information that arrived after work began, guessed instead of asking for clarification, and skipped final verification. Trajectory analysis found that they spent under 7% of their budget detecting and repairing their own errors. [1]

The hardest workflows demanded hidden-state recovery, tracking many items, resolving conflicting sources or adapting to dynamic updates. These challenge labels overlap. They describe where failures concentrated; they do not isolate one cause or add up to 100%.

> **Side box — production teams still keep humans close**
>
> A separate study surveyed 306 practitioners, including 86 involved in deployments, and interviewed 20 deployment teams. It reports that 74% relied primarily on human-in-the-loop evaluation, while 15 of the 20 interviewed teams—75%—operated without formal benchmark sets. This is a different sample and method. It describes reported production practice; it does not replicate the 108-task OSWorld 2.0 result. [2]

## A hypothetical operating scenario

**This scenario is hypothetical; it is not a documented deployment in the study.** A procurement organization asks an agent to assemble a supplier claim. The agent finds the invoice, matches a purchase order, uploads evidence and earns 82% of the workflow checkpoints. It then submits before noticing a later message that changes the accepted quantity.

Calling that run “82% successful” hides the decision that matters. The organization needs separate measures for checkpoint coverage, constraint accuracy, final verification, human escalation, time and cost. Only one of them answers whether a valid claim reached the approval queue.

## Evidence boundaries

- OSWorld 2.0 is an arXiv preprint, not an independently replicated production study.
- Realistic workflows ran in controlled, self-hosted services rather than live enterprise systems.
- A small trained annotation team produced about 90% of the tasks, which may shape benchmark representation.
- Model-based judgment contributed 11.53% of total score, although no task relied on it for more than 50%.
- Rounded aggregate percentages do not always support an exact integer numerator.
- Cost figures are approximate and sensitive to pricing and implementation.
- The benchmark does not measure the real-world consequences of an incorrect payment, clinical action or compliance submission.

## Eight institutional decisions through a 10X lens

1. **Make the final state the unit of success.** Clicks, tool calls and opened documents are activity measures.
2. **Display strict and partial outcomes together.** Partial progress should not conceal a failed deliverable.
3. **Test changing state.** Inject new messages, stale records and conflicting evidence instead of evaluating only clean, static tasks.
4. **Budget for verification and repair.** Measure how much effort the agent spends checking its own work.
5. **Make asking preferable to guessing.** A conflict should trigger clarification or escalation.
6. **Price the marginal result.** The highest score may not create the highest value when it costs 2.84 times as much.
7. **Begin inside reversible boundaries.** Use read-only, draft or human-approval modes before granting send, pay or delete authority.
8. **Build an internal long-horizon suite.** Short demo tasks cannot justify deploying an agent that must work across systems for hours.

## Compact glossary

- **Computer-use agent:** AI that operates software interfaces to pursue a goal.
- **Strict completion:** all required final-state conditions are satisfied.
- **Partial score:** checkpoint credit for progress; not the share of tasks completed.
- **Long horizon:** a workflow long enough for dependencies and errors to accumulate.
- **Implicit state:** relevant information held in records or context rather than the direct instruction.
- **Dynamic environment:** task state changes while execution is in progress.
- **Model-based evaluation:** an AI model judges a bounded part of the output against explicit criteria.

## Conclusion

OSWorld 2.0 shows why an impressive action trace is not an operational capability. The best setup earned more than half of the available partial credit but finished only about one task in five under the benchmark conditions. Across the longest 17 tasks, none of the listed configurations achieved full completion.

The 10X move is not simply to grant more steps. It is to redesign the workflow so the system maintains state, notices change, asks when evidence conflicts and verifies the final result before acting. Activity becomes institutional capability only when it reliably reaches the right end state.

## References

1. Yuan M, et al. *OSWorld 2.0: Benchmarking Computer Use Agents on Long-Horizon Real-World Tasks*. arXiv:2606.29537. 28 June 2026. https://arxiv.org/html/2606.29537
2. Pan MZ, et al. *Measuring Agents in Production*. ICLR 2026 Workshop on Agents in the Wild. https://openreview.net/pdf?id=AsvLggSOvS
