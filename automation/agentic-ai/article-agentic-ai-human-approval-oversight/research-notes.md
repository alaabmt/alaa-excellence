# Research notes — human approval and agent oversight

## Reconciliation context

A bilingual article with this slug was already published on 2026-10-23 outside the daily workflow. It is the same-day Agentic AI item, so no second article is created. The existing pages are being reconciled with the permanent standards.

## Concrete problem

A manager is told that an agent cannot act until a person approves each request. Repeated prompts can turn that safeguard into routine clicking. The operational question is not whether a human is nominally present, but whether controls prevent unauthorized or irreversible actions when attention fails.

## Main documented intervention

Anthropic describes a two-stage classifier in Claude Code auto mode:
- ordinary safe tools and in-project edits can bypass the classifier;
- higher-risk actions reach a fast filter;
- actions flagged by the fast filter receive a second reasoning pass;
- the deployed pipeline can deny an action and let the agent seek a safer path;
- repeated denials escalate or terminate the process.

Primary source: https://www.anthropic.com/research/claude-code-auto-mode (25 March 2026).

## Main datasets and outcomes

Company-reported evaluation:
- real internal traffic: n=10,000 tool calls;
- real overeager actions: n=52;
- synthetic data-exfiltration attempts: n=1,000.

Full pipeline:
- real traffic false-positive rate: 0.4%;
- real overeager-action false-negative rate: 17%;
- synthetic exfiltration false-negative rate: 5.7%.

The source reports percentages, not exact confusion-matrix counts. Approximate counts derived from the rounded rates:
- real traffic: about 40/10,000 benign calls blocked and about 9,960/10,000 allowed;
- real overeager actions: about 9/52 allowed despite risk and about 43/52 blocked;
- synthetic exfiltration: 57/1,000 allowed and 943/1,000 blocked.

The 93% permission-acceptance figure is company-reported without a disclosed denominator or calculation method.

## Governance texts

- EU AI Act, Article 14: human oversight for covered high-risk systems includes understanding capabilities and limitations, awareness of automation bias, ability to disregard/reverse outputs, and ability to intervene or stop.
  - https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng
- Regulation (EU) 2026/1744 moved the applicable date for Annex III high-risk systems to 2 December 2027.
  - https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng
- NIST AI RMF: GOVERN 3.2, MAP 3.5, and MANAGE 4.1 require defined roles, documented oversight processes, and post-deployment override/incident mechanisms.
  - https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
- OECD Principle 1.2 calls for mechanisms and safeguards supporting human agency and oversight.
  - https://oecd.ai/en/dashboards/ai-principles/P6
- OWASP LLM06:2025 recommends human approval for high-impact actions and complete mediation in downstream systems.
  - https://genai.owasp.org/llmrisk/llm062025-excessive-agency/

## Side study

Lyell and Coiera, “Automation bias and verification complexity: a systematic review.”
- 890 papers identified; 40 met inclusion criteria; 6 were in healthcare.
- Among studies testing omission errors, 25/31 (80.6%) found evidence of automation bias; 6/31 (19.4%) did not.
- Among studies testing commission errors, 21/23 (91.3%) found evidence; 2/23 (8.7%) did not.
- This is a cross-domain systematic review, not a direct test of language-model agents.
- https://pmc.ncbi.nlm.nih.gov/articles/PMC7651899/

## Editorial reconstruction

Story order:
1. repeated approval prompt and concrete risk;
2. concise definitions;
3. what Anthropic built and tested;
4. results: total, split, blocked/missed with numerator and denominator;
5. clearly labeled hypothetical procurement example;
6. side box for the independent systematic review and its sample;
7. evidence limits;
8. practical institutional decisions through the 10X lens;
9. key terms, conclusion, references.

## Required corrections to existing publication

- Remove process-oriented first-person/meta language.
- Do not imply that framework requirements are proven effective.
- Present company results as company-reported and internal.
- Add denominators and explain that counts inferred from rounded percentages are approximate.
- Add an explicitly hypothetical example.
- Keep the systematic review in a distinct side box.
- Remove cards from articles.html and en/articles.html; retain them only in the specialist hubs.
