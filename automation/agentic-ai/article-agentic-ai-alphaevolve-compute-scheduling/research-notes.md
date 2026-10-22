# Research Notes — AlphaEvolve and Stranded Compute

## Selected article

- Slug: `article-agentic-ai-alphaevolve-compute-scheduling`
- Publication date: 2026-10-22
- Arabic title: عندما تركت مراكز البيانات قدرة حاسوبية عاطلة: كيف كتب وكيل خوارزمية تستردها؟
- English title: When Data Centers Left Computing Capacity Stranded: How an Agent Wrote a Better Scheduler
- Core question: Can an agent improve a mission-critical scheduling rule when every candidate can be executed and scored, and what evidence is needed before deployment?

## Concrete opening problem

A compute machine may still have free CPU capacity but lack enough memory for an incoming job. A scheduler that repeatedly creates these imbalances leaves capacity stranded: hardware exists, but new jobs cannot use it. At Google fleet scale, even a small recovery can matter, but the public record does not disclose the fleet's absolute capacity or financial value.

## Primary evidence

1. Novikov A, Vũ N, Eisenberger M, et al. *AlphaEvolve: A coding agent for scientific and algorithmic discovery*. arXiv:2506.13131v1, 16 June 2025.
   - https://arxiv.org/abs/2506.13131
   - HTML: https://arxiv.org/html/2506.13131v1
   - Direct support: architecture, data-center scheduling design, unseen test data, fleet deployment, 0.7% recovered compute, kernel and matrix-multiplication results, limitations visible from disclosures.

2. Google DeepMind. *AlphaEvolve: A Gemini-powered coding agent for designing advanced algorithms*. 14 May 2025.
   - https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/
   - Direct support: institutional description and product framing. Treat as a company claim, not independent confirmation.

3. Google DeepMind. *alphaevolve_results*.
   - https://github.com/google-deepmind/alphaevolve_results
   - Direct support: public notebook and verification code for mathematical results that outperformed prior best constructions.
   - Limitation: repository explicitly says it does not contain the code to run AlphaEvolve and excludes matched-but-not-improved problems.

4. Assumpção H, Ferreira D, Campos L, Murai F. *CodeEvolve: an open-source evolutionary framework for algorithmic discovery and optimization*. arXiv:2510.14150.
   - https://arxiv.org/abs/2510.14150
   - Use only in a visually separate side box. It evaluates 9 benchmark problems and reports matching or surpassing AlphaEvolve's reported result on 5/9. It is not an independent audit of Google's fleet deployment.

## What the system did

- AlphaEvolve is an evolutionary coding agent: language models propose edits to executable code; automated evaluators run and score candidates; an evolutionary loop retains useful candidates and produces further variants.
- For scheduling, researchers represented the problem as two-variable vector bin packing: machines have CPU and memory capacity; jobs require both; a heuristic scores eligible machines.
- AlphaEvolve evolved the production heuristic.
- Google used a data-center simulator with historical workload and capacity snapshots for feedback.
- The team tested the candidate on an unseen set of recent workloads and capacity.
- After it outperformed the production heuristic in simulation, Google deployed it across the fleet.
- The heuristic only ranked machines that the Borg scheduler had already determined were capable of running the job; this is why the paper calls the resulting assignments “correct by construction.”

## Central result

- Company-reported post-deployment average: 0.7% of fleet-wide compute resources continuously recovered that would otherwise have been stranded.
- Denominator: all fleet-wide compute resources.
- Numerator: recovered resources, expressed only as a percentage; the absolute compute quantity is not disclosed.
- Status: real production deployment, not a simulation result.
- Evidence boundary: the measurement is reported by the system's developer; no independent audit, observation window, variance, confidence interval, fleet size, cost or energy conversion is published.

## Side evidence from the same technical report

Matrix-multiplication target table:
- Total: 54 configurations.
- Matched prior best: 38/54 = 70.4%.
- Surpassed prior best: 14/54 = 25.9%.
- Fell behind prior best: 2/54 = 3.7%.
- The three groups sum to 54/54.
- One highlighted result reduced the rank for multiplying 4×4 complex-valued matrices from 49 to 48 scalar multiplications.
- These are exact mathematical algorithms according to the report; public verification code exists for the improvements.

Gemini kernel optimization:
- Training and evaluation input shapes were split 50/50, but the absolute number of shapes was not disclosed.
- Company-reported mean kernel speedup: 23%.
- Corresponding overall Gemini training-time reduction: 1%.
- The production heuristic was deployed.
- Do not infer that every kernel sped up by 23%, or that training cost fell by 23%.

## Candidate side box

The open-source CodeEvolve study reports matching or surpassing AlphaEvolve's reported result on 5 of 9 selected benchmark problems (55.6%) under its comparison. This is a separate study with a small selected sample; it supports the reproducibility of the general evolutionary-coding approach, not Google's 0.7% fleet claim.

## Article structure

1. Concrete stranded-capacity scene.
2. Brief definition of AlphaEvolve and evolutionary coding agent.
3. What Google actually did with the scheduler.
4. Production result with denominator and missing absolute numerator.
5. Visually separate result ladder: deployment result, matrix table, correct/wrong interpretations.
6. Side box for CodeEvolve 5/9.
7. Explicitly hypothetical enterprise example.
8. Evidence limits.
9. 10X decisions: evaluator before agent; sandbox and rollback; whole-system metrics; keep human authority.
10. Key terms, closing question and references.

## Editorial cautions

- Never present 0.7% as independently verified.
- Never convert 0.7% to money, energy or machines without a disclosed denominator.
- Do not call the report peer-reviewed.
- Do not say AlphaEvolve's code is open source; only selected result artifacts and verification code are public.
- Distinguish the simulator from the later fleet deployment.
- Distinguish exact mathematical verification from operational performance claims.
- In Arabic, put every English term inside parentheses.
