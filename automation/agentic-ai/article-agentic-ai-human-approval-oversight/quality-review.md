# Quality review — human approval and agent oversight

## Arabic beginner critique and 20–30 second test

### Test prompt

After reading the opening, the first definition, and the results table for 20–30 seconds, can a non-specialist answer:

1. What is the concrete problem?
2. What did the company build and test?
3. What is the main measured failure?
4. What should an institution decide?

### Result

**Pass, with two publication corrections required.**

Expected plain-language answer:
- Repeated approval prompts can make a person click without examining the action.
- The company built a two-stage classifier and tested it on three separate datasets.
- In the selected real-risk set, the classifier allowed about 9 of 52 overeager actions; in the synthetic set, it allowed 57 of 1,000 exfiltration attempts.
- The institution should technically block prohibited actions, automate reversible low-impact actions with logs, and reserve human approval for consequential decisions a qualified person can judge.

### Beginner-reader findings

- The opening is concrete and consequential.
- The definition of an AI agent appears before the technical evaluation.
- The three datasets are separated before the numbers.
- FPR and FNR are explained in plain language.
- The table gives the total, correct result, and incorrect result with numerator and denominator.
- Approximate reconstructed counts are explicitly labeled.
- The hypothetical procurement example is explicitly identified as hypothetical.
- The independent systematic review is isolated in a side box and gives its sample.
- Simulation is distinguished from production.
- Company claims are distinguished from independent evidence and framework requirements.
- Evidence limits appear before the institutional recommendations.
- The 10X lens changes the operating model rather than merely speeding approval.

### Corrections required before publication

1. In the Arabic public page, every English title/name appearing in prose or references must be enclosed in parentheses.
2. Preserve the repository-approved exact Arabic and English editorial disclaimers.

## Metrics audit

- 0.4% of 10,000 = 40; complementary allowed count = 9,960.
- 17% of 52 = 8.84; written as approximately 9 missed and approximately 43 blocked.
- 5.7% of 1,000 = 57; complementary blocked count = 943.
- 25/31 = 80.6%; 6/31 = 19.4%.
- 21/23 = 91.3%; 2/23 = 8.7%.
- No numerator is invented for the 93% permission-acceptance figure.

## Status

Arabic draft may proceed to English drafting after the two publication corrections are enforced in the generated HTML.


## Bilingual semantic parity and final pre-publication gate

### Factual parity

**Pass.** Both editions preserve:
- the 93% company-reported acceptance claim and its missing denominator;
- the three distinct evaluation datasets: 10,000 real internal calls, 52 selected real overeager actions, and 1,000 synthetic exfiltration attempts;
- the full-pipeline rates and the same approximate/exact count boundaries;
- the warning that no overall accuracy can be computed by pooling the rows;
- the hypothetical status of the procurement example;
- the side-study sample and the distinction between study-level prevalence and decision-level error;
- the legal scope limitation for EU high-risk systems;
- the distinction between company evidence, independent research, governance texts, and editorial analysis;
- the same six institutional decisions under the 10X lens.

### Natural-English review

**Pass.** The English edition uses its own narrative sequence and idiom:
- it opens with the approval queue and the consequence of a risky request;
- it frames the intervention as replacing prompt volume with a technical gate;
- it explains the three datasets before displaying the table;
- it does not mirror Arabic sentence structure or paragraph cadence.

A native editor should not infer a sentence-by-sentence translation.

### Arabic terminology review

**Pass subject to HTML enforcement.**
- Technical terms are introduced in Arabic with English forms enclosed in parentheses.
- FPR and FNR are defined at first use.
- The Arabic HTML references must enclose English names and titles in parentheses.
- No process-oriented first-person language from the earlier publication may remain.

### Narrative and evidence gate

**Pass.**
- Concrete problem appears in the first line.
- Concepts are defined at first use.
- Intervention precedes results.
- Results move from total to correct and incorrect with denominators.
- Secondary research is isolated in a labeled side box.
- Hypothetical example is explicitly labeled.
- Limits precede institutional decisions.
- The 10X lens redesigns the operating model.
- Conclusion returns to the practical problem.
- Both editions use the same direct sources.

### Publication placement gate

Required before completion:
- one card and one matching JSON-LD entry in each specialist hub;
- zero cards/links/JSON-LD entries in articles.html and en/articles.html;
- one story cover, one author line, one share component, reciprocal language links, canonical metadata, and approved disclaimers;
- sitemap and publication-date registry entries retained;
- live cover dimensions and load verified.

## Pre-publication status

**Approved for repository publication after the HTML enforcement and placement corrections above.**
