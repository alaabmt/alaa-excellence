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
