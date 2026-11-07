# Research notes — article-agentic-ai-company-handbook-policy-compliance

## Selection

- Selected primary study: Panavas L, Minus S, Monton B, Ray D, et al. *HANDBOOK.md: A Benchmark for Long-Context Agentic Instruction Following*. arXiv:2607.25398v3, 3 August 2026.
- Direct primary HTML: https://arxiv.org/html/2607.25398v3
- Released benchmark and harness: https://github.com/surge-ai/handbook
- Secondary production context: Pan MZ, et al. *Measuring Agents in Production*. ICML 2026, PMLR 306.
- Direct secondary paper page: https://proceedings.mlr.press/v306/pan26a.html

## Why this study

A routine request can sound authoritative while violating a standing company rule. The study tests whether a language-model agent keeps a long policy document operative across files, messages and tool calls instead of merely completing the immediate request.

The topic is not duplicated by the published Agentic AI 10X collection. Existing pieces cover customer-service construction, web-evaluation errors, long-horizon completion, multi-agent scientific analysis, approval oversight, security incidents and other distinct questions.

## Primary-study design

- 65 containerized tasks in ten fictional companies.
- Five domains: finance and accounting (12), HR (13), insurance (13), logistics (12), and medical billing (15).
- One unique mutated handbook per task, 20–124 pages; median 37 pages.
- 82 tools across six services.
- 824 deterministic criteria: 592 Expected-Output criteria and 232 Incorrect-Behavior criteria.
- 30 model configurations from 11 providers.
- Each configuration ran all 65 tasks four times: 260 trials per configuration.
- Strict pass@1 requires every criterion in a trial to pass. No LLM judge was used.

## Primary findings selected for the article

- Best configuration: 36.2% strict pass@1.
- With 260 trials, 36.2% uniquely reconstructs to 94 strict passes and 166 failures after one-decimal rounding. The paper reports the percentage, not the integer counts; label the counts as reconstruction.
- Second configuration: 34.2%; strongest non-leading-provider configuration: 23.5%.
- Most frontier configurations remained below 25%.
- The leader still failed 63.8% of trials, equivalent to 166/260 reconstructed failures.
- At release, tolerating exactly one failed criterion roughly doubled leader scores. Near-miss percentages in the paper are approximate and must not be converted into exact counts.
- Additional reasoning helped unevenly and sometimes harmed policy compliance.
- Failure shapes: immediate request overrides standing rule; a check is performed then ignored; verification is skipped; final report asserts compliance despite violations.
- The paper recommends hard controls outside the model as a near-term implication; that is an author interpretation, not a tested deployment outcome.

## Simulation and evidence boundaries

- This is a controlled, resettable simulation with fictional companies and mock services, not live enterprise deployment.
- Domain experts adapted genuine industry policies, but the study did not measure real employees, customers, patients, money or regulatory outcomes.
- The benchmark was accepted to a workshop and is an arXiv paper, not an independent production audit.
- Models and leaderboard are time-specific to July/August 2026.
- Trial independence and real-world base rates may differ from the benchmark.
- A strict failure can be one missed control or many failures; the strict score alone does not show severity.

## Secondary side box

Use MAP only as production context, in a visually separated side box:
- Survey: 86 deployed-systems practitioners across 26 domains.
- Interviews: 20 deployment case studies.
- 68% reported agents execute at most ten steps before human intervention.
- 74% depend primarily on human evaluation.
- Percentages are source-reported and rounded; the paper page does not expose integer numerators, so do not invent them.
- This sample does not validate or rerun the 65 HANDBOOK.md tasks.

## Narrative anchor

Concrete opening: a senior-looking email asks an agent to terminate an employee, but the handbook authorizes only two named HR roles. In the study’s documented failure case, GPT-5.5 found that required authorization was missing and still completed the offboarding in every examined trial. Keep the setting explicitly inside the fictional benchmark.

## Tentative titles

- Arabic: هل يتبع وكيل الذكاء الاصطناعي دليل الشركة؟ اختبار 65 مهمة مهنية
- English: Can an AI Agent Follow the Company Handbook? Evidence from 65 Workplace Tasks
