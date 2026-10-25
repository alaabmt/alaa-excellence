# When Data Centers Left Computing Capacity Stranded: How an Agent Wrote a Better Scheduler

Dr. Alaa Mohammad Ahmed

A server can have idle processors and still be unable to accept the next job because it lacks enough free memory. Another machine may have memory to spare but not the required processing capacity. The hardware is present, yet the scheduler cannot use it efficiently. At data-center scale, this mismatch leaves compute stranded.

Fixing the problem is not as simple as asking an AI model for a clever line of code. A scheduling rule sits inside mission-critical infrastructure. A candidate must perform better on workloads it has not seen, preserve operational constraints, remain understandable to engineers and be reversible if production behavior changes.

## The agent was not allowed to grade its own work

Google DeepMind built AlphaEvolve as an **evolutionary coding agent**. Large language models generate executable code changes, automated evaluators run and score the candidates, and an evolutionary loop retains useful programs and develops further variants from them.

That distinction matters. A language model can produce plausible code that is wrong or optimizes the wrong thing. AlphaEvolve's core loop does not treat fluency as evidence. A candidate survives because it executes and improves a defined score.

This design works best when the organization can turn the outcome into a reliable evaluator. “Make scheduling better” is too vague. A program that measures stranded capacity, waiting time and constraint violations gives the agent feedback it can act on.

## What Google actually changed

The team represented online job scheduling as a two-dimensional vector bin-packing problem. Machines had available CPU and memory capacity; incoming jobs required both. A heuristic assigned a priority score to each possible machine.

AlphaEvolve did not replace Google's Borg cluster manager. Borg first identified machines that were available and capable of running a pending job. The evolved heuristic then ranked those eligible machines. The paper therefore describes eligibility as correct by construction: the new rule could not select a machine Borg had already rejected as incapable.

The path to production had three distinct stages:

1. A data-center simulator replayed historical snapshots of workloads and capacity and supplied feedback to the agent.
2. The resulting heuristic was evaluated on a recent, unseen set of workloads and capacity.
3. After it outperformed the production rule in simulation, Google rolled it out across the fleet and measured it in operation.

The simulator was a gate, not the final result.

## What the production measurement says—and does not say

Google's technical report says the deployed heuristic continuously recovered an average **0.7% of fleet-wide compute resources** that would otherwise have remained stranded.

| Measurement element | Published | Not published |
|---|---|---|
| Denominator | All fleet-wide compute resources | Absolute fleet capacity |
| Numerator | Recovered capacity expressed as 0.7% | Absolute recovered compute |
| Setting | Post-deployment operation | Measurement period and site-level distribution |
| Uncertainty | Average of 0.7% | Variance or confidence interval |
| Economic and environmental effect | None reported | Cost, energy and emissions impact |

The defensible reading is narrow: Google attributes recovery equal to 0.7 of every 100 units of fleet compute to the deployed heuristic. It does not establish that overall utilization rose by 0.7 percentage points, energy use fell by 0.7%, or costs dropped by the same share. None of those conversions can be made without the missing denominator and system data.

The result is also a company-reported production measurement. Moving from simulation to deployment makes it stronger than a benchmark alone, but the public evidence does not include an independent audit.

## A result ladder with all outcomes visible

The report also evaluated AlphaEvolve on mathematical problems where candidate programs could be checked exactly. For 54 matrix-multiplication configurations, the outcome split was:

| Outcome | Numerator / denominator | Reconstructed share |
|---|---:|---:|
| Matched the previous best | 38 / 54 | 70.4% |
| Beat the previous best | 14 / 54 | 25.9% |
| Fell behind the previous best | 2 / 54 | 3.7% |
| Total | 54 / 54 | 100.0% |

The agent did not beat the state of the art in all 54 cases. It improved 14, matched 38 and trailed in two.

One highlighted construction multiplies two 4×4 complex-valued matrices using 48 scalar multiplications instead of the previous 49. That is one fewer multiplication, a 2.04% reduction in the operation count for this exact construction. It is not evidence that every matrix-heavy application runs 2.04% faster.

Google DeepMind published a notebook with verification code for the mathematical improvements. The repository does not contain the code required to run AlphaEvolve itself, and it excludes cases that only matched the prior best.

> ## Side box: a separate open-source test
>
> CodeEvolve, an independently developed open-source evolutionary framework, was evaluated on nine selected problems from the AlphaEvolve benchmark set. Its authors report matching or surpassing AlphaEvolve's published result on 5 of 9 problems, or 55.6%; it did not do so on 4 of 9, or 44.4%.
>
> This is a small selected sample. It shows that the broader evolutionary-coding pattern can be implemented outside Google's closed system. It does not reproduce Google's fleet, audit the 0.7% recovery claim or validate every AlphaEvolve result.

## Why a 23% component gain became a 1% system gain

In another application, the team asked AlphaEvolve to improve a tiling heuristic for a matrix-multiplication kernel used in Gemini training. The researchers collected realistic input shapes and divided them evenly: half for optimization and half for evaluation. They did not disclose the number of shapes, so the 50/50 split has no public numerator or denominator.

Google reports an average 23% kernel speedup over an expert-designed heuristic and a corresponding 1% reduction in Gemini's overall training time. The difference is instructive. A kernel is only one part of training; speeding it up does not remove the time spent elsewhere.

A component metric can be technically correct and still exaggerate enterprise value if it is presented as a whole-system result.

## A hypothetical enterprise pilot

**The following example is hypothetical. It is not part of Google's study.**

An organization operates an internal analytics platform with an average of 500 units of compute capacity. Some jobs wait because free CPU and memory are distributed poorly across machines. Before buying more hardware, the platform team builds a simulator from its own logs and defines an evaluator that combines completed jobs, stranded capacity, waiting time and service-level violations.

A coding agent may generate candidate ranking rules, but it receives no deployment authority. Candidates pass through historical replay, a held-out time period, shadow deployment and a limited reversible trial.

If the organization hypothetically recovered 0.7% of 500 units, the arithmetic would be 3.5 units. That calculation only shows how a denominator works. It does not predict the organization's outcome. A different workload or incomplete evaluator could produce no gain or make performance worse.

## Where the evidence stops

The AlphaEvolve report was written by the system's developers at Google DeepMind and is presented as a technical report, not a peer-reviewed study. Public material does not disclose the number of simulator snapshots, the test-set size, the post-deployment observation period, the variation around 0.7%, or the fleet's absolute scale.

The agent is closed-source. The public results repository makes selected mathematical improvements inspectable, but it does not provide the orchestration code, prompts, model calls and computing resources needed to reproduce AlphaEvolve.

The approach also depends on evaluator quality. If the score omits maintainability, fairness, safety or user experience, an agent may improve the published metric while degrading the unmeasured system. Executable feedback reduces one class of error; it does not prove that the objective is complete.

## The 10X Lens: build the evaluator before granting agency

The institutional opportunity is not “put an agent in software engineering.” It is to identify a repeated decision that wastes capacity, make its full outcome measurable, and separate rapid search for alternatives from authority to change production.

Four design decisions follow:

1. **Measure the whole value equation.** Runtime is not enough if failures, delays or maintenance burden rise.
2. **Separate proposal from authority.** Let the agent generate candidates in a sandbox while named people retain approval, deployment and rollback authority.
3. **Test outside the optimization data.** Require a held-out period, shadow operation and a bounded trial before scale.
4. **Track the system effect.** Measure recovered capacity, queue time, quality, incidents, human review and computational cost together.

The 10X capability is not the volume of code an agent can produce. It is an operating loop that can explore many alternatives, reject weak ones automatically, validate strong ones under realistic conditions, deploy gradually and reverse the change when the evidence turns.

## Key terms

- **Evolutionary coding agent:** a system that generates, executes, scores and iteratively improves programs.
- **Large language model (LLM):** a model that generates text or code from context and instructions.
- **Vector bin packing:** assigning items that consume several resources to capacity-limited containers.
- **Evaluator:** a test or program that computes the quality of a candidate solution.
- **Shadow deployment:** running a system on live inputs without letting its decisions affect production.
- **Confidence interval:** a range expressing statistical uncertainty around an estimate; none was published for the 0.7% result.

## The remaining question

If an organization intends to deliver more work from the same infrastructure five years from now, does it already have the operational data, evaluators, test environments and authority boundaries that would let an agent search safely for a better method—or would it give the agent an incomplete target and discover the missing objective only after deployment?

## References

1. Novikov A, Vũ N, Eisenberger M, et al. **AlphaEvolve: A coding agent for scientific and algorithmic discovery.** arXiv:2506.13131v1. 16 June 2025. https://arxiv.org/abs/2506.13131
2. Google DeepMind. **AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms.** 14 May 2025. https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/
3. Google DeepMind. **Results of AlphaEvolve.** Public results and mathematical verification notebook. https://github.com/google-deepmind/alphaevolve_results
4. Assumpção H, Ferreira D, Campos L, Murai F. **CodeEvolve: an open-source evolutionary framework for algorithmic discovery and optimization.** arXiv:2510.14150. 15 October 2025. https://arxiv.org/abs/2510.14150
