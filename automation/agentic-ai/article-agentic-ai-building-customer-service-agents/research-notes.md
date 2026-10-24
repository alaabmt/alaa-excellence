# Research notes — Can AI reliably build a customer-service agent?

- Slug: `article-agentic-ai-building-customer-service-agents`
- Publication date: 2026-10-24 (Asia/Dubai)
- Primary study: Shi Q, Dhandhania K, Narasimhan K, Barres V. *τ^τ-Bench: An Environment for End-To-End, Realistic Agent Construction*. arXiv:2609.04611v1, 4 September 2026.
- Direct paper: https://arxiv.org/html/2609.04611v1
- Code and released tasks: https://github.com/sierra-research/hyper-tau-bench
- Secondary study for a side box only: Huang KH et al. *CRMArena-Pro: Holistic Assessment of LLM Agents Across Diverse Business Scenarios and Interactions*. arXiv:2505.18878. https://arxiv.org/html/2505.18878v1
- Governance reference: NIST AI Risk Management Framework Core. https://airc.nist.gov/airmf-resources/airmf/5-sec-core/

## Concrete problem

A business may delegate construction of a customer-service agent to a coding agent. The delivered system can run and pass self-authored tests while still missing policies, stakeholder requirements, API defects, cost constraints, and held-out customer situations.

## What the primary study did

The researchers created 53 construction tasks across four simulated domains: airline (6), retail (6), telecom (6), and banking (35). Each developer configuration received business-style records, sometimes an interactive simulated client, a codebase or neutral stubs, a client-owned REST API, a model menu, and a serving-cost budget. It had one construction trial per task and up to eight wall-clock hours. The built customer-service agent was then evaluated on held-out simulated users.

The evidence corpus contained 2,868 distinct artifacts. Text artifacts alone exceeded 5.5 million tokens. The study evaluated six developer configurations. The expert reference was written by a benchmark author with access to ground truth; it is an oracle ceiling, not average human performance.

## Key published results

- Best automated developer: Claude Opus 5 in Claude Code, mean score 23.9/100 across 53 task-level scores.
- Expert-authored reference ceiling: 82.2/100 across the same 53 task positions.
- Best automated developer by domain:
  - airline: 55.9/100 mean across 6 construction tasks;
  - retail: 72.8/100 mean across 6;
  - telecom: 48.2/100 mean across 6;
  - banking: 5.9/100 mean across 35.
- Other overall means across 53 tasks:
  - GPT-5.6-sol in Codex: 22.0/100;
  - GPT-5.6-terra in Codex: 18.0/100;
  - Claude Sonnet 5 in Claude Code: 14.9/100;
  - Kimi K3 in Kimi Code: 16.1/100;
  - Kimi K3 in OpenCode: 17.9/100.
- Average build time and listed API cost:
  - GPT-5.6-sol/Codex: 47.9 minutes and $18.2 per construction task;
  - Claude Opus 5/Claude Code: 216.3 minutes and $42.0;
  - Kimi K3/Kimi Code: 205.7 minutes and $13.5.
- Calls spent talking to the simulated client were 0.3% of all recorded tool calls.
- On client-enabled tasks, builds asking no questions averaged 0.16 reward; builds asking four or more averaged 0.50. The paper does not publish the subgroup counts in the main text, so these are associations, not a causal estimate.
- Nearly every completed build used a single LLM tool loop: 92% of builds. The figure reports a share, but the exact completed-build denominator is not printed beside that percentage.
- In a controlled telecom probe, a one-line architecture hint raised the score from 31/100 to 67/100. The paper does not state the number of held-out simulations beside this comparison.
- Banking complexity: 2,969 atomic facts; one banking task could draw on up to 580. Airline, retail, and telecom contained 85, 119, and 155 atomic facts respectively.
- Whole-domain banking corpus example: 1 of 93 evaluation cases succeeded, 92 of 93 did not; score 1.1%.

## Measurement interpretation

The overall score is an unweighted mean of 53 task-level scores. A task score is mean held-out evaluation reward minus any serving-budget overage penalty. Therefore 23.9% must not be restated as “about 13 of 53 projects succeeded.” The paper does not publish a single aggregate numerator and denominator of all held-out simulations. The article must show 23.9/100 as a mean score across 53 tasks and state that absolute correct/incorrect counts are unavailable.

Likewise, the expert 82.2/100 is a ceiling produced with ground-truth access. It is not a randomized human-versus-agent comparison and not a claim about average software teams.

## Story order

1. Concrete procurement/deployment problem: a system that runs can still be unsafe to ship.
2. Define developer agent and held-out simulation.
3. Explain the 53-task construction setup.
4. Show overall mean, then domain split, then what can and cannot be called correct/incorrect.
5. Labelled hypothetical institutional example.
6. Secondary CRMArena-Pro study in a side box with its 19 expert-validated task types; do not interrupt the primary story.
7. Evidence limits.
8. 10X institutional decisions: evidence inventory, stakeholder interview requirement, hidden acceptance suite, cost-quality search, API fault testing, and staged authority.
9. Glossary, conclusion, primary references.

## Evidence limits

- Preprint version 1; not peer reviewed in the cited version.
- Entire environment is simulated and English-language.
- Six developer configurations; one construction trial per configuration per task, so build-to-build variance is not estimated.
- Simulated client and users are single LLMs with fixed requirements and simplified behavior.
- The task mix is uneven: 35 of 53 tasks are banking.
- Expert reference has ground-truth access and is an oracle ceiling.
- Percent scores are not raw counts of projects passed.
- Results do not establish production defect rates, ROI, or safety in a specific institution.
