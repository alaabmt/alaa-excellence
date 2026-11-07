# Research notes — multi-agent scientific analysis cost

Date: 2026-10-26 (Asia/Dubai)  
Proposed slug: `article-agentic-ai-multi-agent-scientific-analysis-cost`

## Editorial question

A scientific-analysis agent can produce fluent prose without ever reaching a realistic, finite numerical result. ST-Bench asks whether a generated multi-agent workflow reaches real computation more often than a one-turn agent using the same GPT-5 backbone, and whether the gain justifies additional inference time.

## Primary source selected

Qi Cheng et al., *ST-Bench: A Spatial-Temporal Benchmark for Multi-Agent System Generation on Scientific Research Tasks*, arXiv:2610.07763v1, submitted 6 October 2026.

Direct source: https://arxiv.org/html/2610.07763v1

Selection reasons:
- Primary paper with methods, dataset construction, evaluation formulas and results.
- 100 paper-adapted Earth-science data-analysis tasks expanded to 2,067 queries.
- 492 held-out test queries support the headline evaluation.
- Same GPT-5 backbone and model settings for the main single-agent baseline and generated multi-agent systems; the workflow changes.
- Reports absolute score, task win rate, mean gain, inference-time ratio, coverage and conditional quality.
- Makes the evidence limitation explicit: simulated benchmark analysis, not autonomous real-world science.

## What the researchers actually did

1. Defined 16 data-science task categories.
2. Populated them with 100 tasks adapted from peer-reviewed work in hydrology, agriculture and wetland methane, plus 11 general-control tasks.
3. Expanded the tasks into 2,067 paper-grounded queries.
4. Split queries into 1,184 training, 391 validation and 492 held-out test queries.
5. Evaluated five multi-agent-generation methods under per-task and per-category training, creating ten configurations.
6. Compared them with a one-turn GPT-5 baseline under the same backbone and core settings.
7. Counted an output as realistic only when it contained parsable finite metrics, at least one strictly positive value and no -1 sentinel.
8. Scored each task as realistic-output success rate multiplied by the mean pass rate of scientific metrics, then summed across 100 tasks to a maximum of 100.

## Headline findings

- GPT-5 one-turn baseline: 11.0/100 composite score.
- Multi-agent configurations beating baseline: 9/10 (90%); not beating it: 1/10 (10%).
- Strongest absolute score: GPTSwarm per-category, 32.0/100; gain +21.1 points; about 4.5× inference time.
- GPTSwarm per-task: 30.3/100 and highest task win rate, 51/100 tasks (51%); therefore it did not beat the baseline on 49/100 tasks.
- Most cost-efficient reported point: W4S per-task, 29.4/100; gain +18.4 points; 1.85× inference time.
- Conditional pass rates after a realistic output existed clustered around 50–58%; the main gain came from reaching a realistic computation on more queries, not consistently producing better metrics once computation succeeded.
- One multi-agent configuration, AutoAgents per-category, scored 8.2/100, below the 11.0 baseline, because its five-query-per-category cap left many queries unreached.

## Core interpretation

The evidence does not show that multi-agent systems are universally more accurate. It shows that several optimized workflows reached valid numerical computation more often in a controlled benchmark, at material time cost. Selection depends on whether the operating objective is maximum coverage, improvement per unit of compute, or broad transfer across related tasks.

## Secondary evidence for a side box only

Ziru Chen et al., *ScienceAgentBench: Toward Rigorous Assessment of Language Agents for Data-Driven Scientific Discovery*, arXiv:2410.05080.

Direct source: https://arxiv.org/abs/2410.05080

Sample: 102 tasks extracted from 44 peer-reviewed papers across four disciplines and validated by nine subject-matter experts. With three attempts per task, the paper reports 32.4% independently solved and 34.3% with expert-provided knowledge for the best reported agent condition. This supports the caution that scientific-agent capability is incomplete, but it is not part of ST-Bench and must not interrupt the main narrative.

## Proposed titles

Arabic: **عندما لا يصل الوكيل إلى رقم قابل للحساب: هل يبرر فريق من الوكلاء كلفة أعلى بـ4.5 مرات؟**

English: **When One Agent Never Reaches the Number: Is a Multi-Agent Workflow Worth 4.5× the Time?**

## Evidence decision

**ACCEPT.** The primary paper supports a problem-first, evidence-led article with reconstructable counts, a clear cost-performance trade-off and material limitations. No production or causal claim will be inferred beyond the benchmark.
