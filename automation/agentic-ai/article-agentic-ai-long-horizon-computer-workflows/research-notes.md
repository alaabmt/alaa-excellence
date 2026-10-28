# Research notes — OSWorld 2.0

## Editorial problem

A computer-use agent may complete many local steps and still leave a professional workflow unfinished. The primary study separates partial progress from strict end-to-end completion across long tasks rather than isolated clicks.

## Primary source

Mengqi Yuan et al., **OSWorld 2.0: Benchmarking Computer Use Agents on Long-Horizon Real-World Tasks**, arXiv:2606.29537, submitted 28 June 2026.

- Direct HTML: https://arxiv.org/html/2606.29537
- Abstract: https://arxiv.org/abs/2606.29537
- Source type: research preprint and released benchmark.

## What the researchers built

- 108 long-horizon computer-use tasks.
- 31 self-hosted web services plus desktop applications.
- Seven professional domains and 21 subcategories.
- Median skilled-human operation time: about 1.6 hours.
- 69.6% of tasks were estimated to take a skilled human more than one hour.
- Average scoring checkpoints: 27.25 per task.
- Model-based judgment contributed 11.53% of the total score; no task relied on it for more than 50%.
- Each task was human re-solved and audited for reward hacking and false negatives.

## Main result

At the 500-step budget, the strongest tested configuration—Claude Opus 4.8 with maximum thinking and batched actions—reported 20.6% strict binary completion and 54.8% partial score across the 108-task benchmark. The paper does not publish an integer numerator for this rounded aggregate; an article must not invent one. The rounded equivalent is about 22 fully completed task-equivalents and about 86 non-completions, labeled explicitly as an equivalence rather than raw counts.

GPT-5.5 reported 13.0% strict completion and 49.5% partial score while using about 37.1K output tokens and an estimated $25.5 per task, compared with 224K tokens and about $72.4 per task for the top Opus setting.

## Length effect

For the longest human-time bin, 17 tasks estimated at 163–360 minutes, all four reported frontier/open configurations in Table 21 had 0.0% strict completion. This supports the exact statement 0 of 17 completed and 17 of 17 not completed within each listed model configuration for that bin.

## Failure mechanism

The paper reports that agents spent under 7% of their budget detecting and repairing their own errors. Failures clustered around hidden-state recovery, tracking many items, resolving conflicts, and adapting to dynamic updates. This is benchmark behavior, not proof about every production deployment.

## Secondary side box

Melissa Z. Pan et al., **Measuring Agents in Production**, ICLR 2026 Workshop on Agents in the Wild.

- Direct paper: https://openreview.net/pdf?id=AsvLggSOvS
- Sample: survey of 306 practitioners, including 86 involved in deployments, plus 20 in-depth deployment-team interviews.
- Context result: 74% reported human-in-the-loop evaluation as the primary approach; 75% of interviewed teams evaluated without formal benchmark sets. These are different denominators and must not be converted into invented integer counts unless the paper provides them.
- Use only as an explicitly separate context box; it is not a replication of OSWorld 2.0.

## Editorial angle

The institutional decision is not whether an agent can produce visible progress. It is whether the system can preserve constraints, notice changing state, ask when evidence conflicts, verify the final state, and finish the entire workflow at an acceptable cost.
