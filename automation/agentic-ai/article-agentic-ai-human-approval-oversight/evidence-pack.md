# Evidence Pack — human approval and agent oversight

## Evidence grading

- **High:** direct official/legal text or peer-reviewed study supports the bounded claim.
- **Medium:** primary company source reports its own system or internal evaluation, but independent replication is absent.
- **Analytical:** institutional recommendation inferred from the evidence; not a reported finding.

| ID | Claim | Direct source | Source type | Confidence | Evidence limit |
|---|---|---|---|---|---|
| E1 | Claude Code users accept 93% of permission prompts. | https://www.anthropic.com/research/claude-code-auto-mode | Company engineering report, 25 Mar 2026 | Medium | Denominator, user population, observation window, and calculation method are not disclosed. This does not establish that 93% of approvals were careless or wrong. |
| E2 | Auto mode uses allow rules, a fast classifier, and a second reasoning stage for flagged actions. | Same as E1, lines/sections “How permission decisions work” and “Results” | Primary product/engineering description | Medium | Describes the maker’s system; no independent audit of implementation. |
| E3 | Evaluation datasets were 10,000 real internal tool calls, 52 real overeager actions, and 1,000 synthetic exfiltration attempts. | Same as E1, Results | Primary company evaluation | Medium | Internal employees and curated incidents may not represent customers or other agents. Synthetic attempts are not production incidents. |
| E4 | Full-pipeline FPR was 0.4% on 10,000 real internal calls. | Same as E1 | Primary company evaluation | Medium | Percentage is reported without the exact confusion matrix. Approximate 40/10,000 benign calls blocked is derived from the rounded rate. |
| E5 | Full-pipeline FNR was 17% on 52 real overeager actions. | Same as E1 | Primary company evaluation | Medium | Small, curated set. Approximate 9/52 missed and 43/52 blocked are derived from the rounded rate, not published exact counts. |
| E6 | Full-pipeline FNR was 5.7% on 1,000 synthetic exfiltration attempts. | Same as E1 | Primary company evaluation | Medium | Synthetic benchmark; 57/1,000 missed and 943/1,000 blocked follow directly if 5.7% is exact, but do not measure production harm. |
| E7 | The maker says auto mode is not a replacement for careful human review on high-stakes infrastructure. | Same as E1 | Primary company statement | Medium | A stated use boundary, not an effectiveness result. |
| E8 | EU AI Act Article 14 requires covered high-risk systems to support informed oversight, awareness of automation bias, disregard/reversal of output, and safe stopping. | https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng | Consolidated official legal text | High for legal wording | Applies only where the system is legally classified high-risk; being an agent alone does not trigger that classification. Not proof that the measures work. |
| E9 | Regulation (EU) 2026/1744 sets 2 Dec 2027 for Annex III high-risk systems. | https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng | Official amending regulation | High | Legal timing can depend on the exact provision and category; article states only the Annex III date. |
| E10 | NIST AI RMF calls for defined roles, documented oversight, and post-deployment override/incident mechanisms. | https://airc.nist.gov/airmf-resources/airmf/5-sec-core/ | Official voluntary framework | High for framework wording | Voluntary framework; does not prove effectiveness of any particular control. |
| E11 | OECD Principle 1.2 calls for safeguards supporting human agency and oversight. | https://oecd.ai/en/dashboards/ai-principles/P6 | Official intergovernmental principle | High for wording | Principle, not tested implementation. |
| E12 | OWASP LLM06:2025 recommends approval for high-impact actions and downstream authorization checks. | https://genai.owasp.org/llmrisk/llm062025-excessive-agency/ | Official security guidance | High for guidance wording | Guidance, not a comparative trial. |
| E13 | Systematic review: 890 records identified; 40 studies included; 6 healthcare. | https://pmc.ncbi.nlm.nih.gov/articles/PMC7651899/ | Peer-reviewed systematic review | High | Studies vary by domain and automation type; not language-model agent research. |
| E14 | Omission-error evidence appeared in 25/31 studies (80.6%), absent in 6/31 (19.4%). | Same as E13 | Peer-reviewed systematic review | High for reviewed sample | “Evidence in studies” is not an individual-user error rate and should not be generalized as 80.6% of decisions. |
| E15 | Commission-error evidence appeared in 21/23 studies (91.3%), absent in 2/23 (8.7%). | Same as E13 | Peer-reviewed systematic review | High for reviewed sample | Same caveat; study-level share, not decision-level incidence. |
| E16 | Reserve human approval for consequential decisions a qualified person can judge; use technical blocks for prohibited actions and logs for reversible actions. | Synthesis of E7–E12 | Editorial/10X analysis | Analytical | Proposed operating model, not experimentally validated in this exact form. |

## Claim boundaries

1. Do not describe the Anthropic metrics as independently verified.
2. Do not call 93% an error rate or rubber-stamp rate.
3. Do not call a 17% false-negative rate “17% of all actions”; it is 17% of 52 selected real overeager actions.
4. Do not merge the 52 real incidents with the 1,000 synthetic attempts.
5. Do not treat regulatory or framework requirements as effectiveness evidence.
6. Keep the systematic review in a side box and label its sample and indirect relevance.
7. Label any procurement workflow as hypothetical.

## Primary-source set used by both language editions

1. Anthropic engineering report: https://www.anthropic.com/research/claude-code-auto-mode
2. EU AI Act consolidated text: https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng
3. Regulation (EU) 2026/1744: https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng
4. NIST AI RMF Core: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
5. OECD AI Principle 1.2: https://oecd.ai/en/dashboards/ai-principles/P6
6. OWASP LLM06:2025: https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
7. Lyell & Coiera systematic review: https://pmc.ncbi.nlm.nih.gov/articles/PMC7651899/
