# Quality Review — SWE-Lancer Article

## Beginner-reader critique

- **Draft reviewed:** `draft-ar.md` at commit `42fedc3daf167229a023723bbcfccbf86d8fcdde`
- **Reader profile:** intelligent general reader with no prior familiarity with agentic AI, software benchmarks, pass@1, or SWE-Lancer.
- **Decision:** pass after two targeted clarity revisions; no evidence or metric changes required.

### 20–30 second comprehension test

After reading the opening, the first benchmark explanation, and the quick-check box, the reader should be able to answer:

1. **What was tested?** AI systems on 1,488 real historical software tasks worth $1 million in past payouts.
2. **What does “earned dollars” mean?** Benchmark credit equal to historical task payouts, not money paid to a model.
3. **Did the original best model solve most tasks?** No; it solved 36.1% of combined Diamond tasks and 33.7% of the full set.
4. **What does 53% refer to?** Corrected July 2025 IC software-engineering results only, averaged across three pass@1 runs.
5. **Does the benchmark prove job replacement?** No; it measures bounded task performance in one repository and scaffold.

**Result:** all five answers are recoverable without consulting the references.

### Confusion scan

| Risk | Observation | Required revision |
|---|---|---|
| Undefined English product name | “deep research” appears before an Arabic explanation. | Change first occurrence to “نموذج البحث العميق (deep research)” and explain that “post-mitigation” means after OpenAI’s stated improvements/mitigations. |
| Statistical jargon | “ثلاث جولات من مقياس المحاولة الواحدة” is accurate but dense. | Add a short parenthetical: each run gives the agent one attempt per task, then the three run-level results are averaged. |
| Version mixing | Original Diamond is $500,800 while revised maximum is $453,800. | Already clearly separated; retain explicit prohibition on mixing numerator and denominator. |
| Dollar interpretation | Readers may mistake benchmark credit for wages or realized savings. | Already repeated in the opening, July section, glossary, and 10X decision section. |
| Task representativeness | Readers may generalize to all programming jobs. | Already constrained by company, codebase, bug-fix concentration, modality, and scaffold limitations. |
| Story flow | A secondary July result could interrupt the original-paper narrative. | Current order is sound: problem → benchmark → original results → revision → application → limits → decisions. |
| Hypothetical example | Institutional example might be mistaken for study evidence. | It is explicitly labeled hypothetical before the scenario. |
| Numerator/denominator visibility | Percentages might hide base sizes. | Core dataset percentages show both counts; result sections name their exact scope and denominator. |

## Evidence audit

- Full benchmark subtotals close: 764 + 724 = 1,488; $414,775 + $585,225 = $1,000,000.
- Original Diamond subtotals close: 237 + 265 = 502; $236,300 + $264,500 = $500,800.
- July revision closes: 237 − 198 = 39; $500,800 − $453,800 = $47,000.
- Original model results remain labeled as ICML/PMLR-era results.
- Corrected 53% / $87,708 result remains IC-only and is not paired with the original $500,800 denominator.
- No exact task count is inferred from averaged 53%.
- Rounded Table 1 dollar figures are described as approximate.

## Editorial checks

- Concrete problem appears in the first paragraph.
- “Benchmark,” “agent,” E2E testing, task families, pass@1, Diamond, denominator, and payout credit are defined.
- Author name appears directly below the Arabic title.
- The article contains a glossary, practical 10X decisions, limitations, conclusion, and primary references.
- Tone avoids workforce-replacement certainty and promotional overclaiming.
- No secondary study interrupts the main narrative.

## Revisions to apply

1. Clarify the first “deep research/post-mitigation” mention.
2. Expand the averaged pass@1 sentence for a reader unfamiliar with repeated evaluation runs.

After these two edits, the Arabic draft passes the beginner-reader gate and can advance to independent English drafting.


## Bilingual semantic parity review

- **Arabic draft reviewed:** `draft-ar.md` at commit `cc48eb17e686c2d92675eaa0694220b2af399063`
- **English draft reviewed:** `draft-en.md` at commit `9642a6903de2064a715f6e1213801f6724f1619f`
- **Review type:** bilingual editorial comparison against `evidence-pack.md` and `metrics-check.md`
- **Content-parity decision:** PASS after Arabic alignment revisions
- **Responsive/page-component parity:** pending final HTML and real mobile verification; not claimed at the draft stage

### Parity matrix

| Element | Arabic | English | Result |
|---|---|---|---|
| Concrete software-work opening | Government/company operational failures | Software-team operational failures | PASS — equivalent problem, native phrasing |
| Benchmark definition | Organized test; 1,488 tasks; $1m historical payout | Same | PASS |
| Author attribution | الدكتور علاء محمد أحمد directly below title | Dr. Alaa Mohammad Ahmed directly below title | PASS |
| Full task split | 764 IC / 724 manager | Same | PASS |
| Full payout split | $414,775 / $585,225 and 41.48% / 58.52% | Same | PASS after Arabic revision |
| Original Diamond | 237 IC worth $236,300; 265 manager worth $264,500; 502 total; $500,800 | Same | PASS after Arabic revision |
| Public share | 33.74% of tasks; 50.08% of payout | Same | PASS |
| Original leading results | 36.1% / 41.5%; o1 29.7% / 33.1%; GPT-4o 23.3% / 27.7% | Same | PASS |
| Task-family results | 26.2% IC; 44.9% manager | Same | PASS |
| Full-set result | 33.7%; about $403k; 40.3% | Same | PASS |
| July revision | 237 → 198; 39 dropped; 16.46%; $500,800 → $453,800 | Same | PASS |
| Corrected result | 53% over three pass@1 runs; exact $87,708; IC-only | Same | PASS |
| o1 comparison limit | “nearly twice,” exact revised o1 value unavailable | Same | PASS after Arabic revision |
| Invalid calculations | No 53% exact solved count; no IC earn rate using combined denominator | Same | PASS |
| Hypothetical pilot | 100 tickets, 20 selected, human gate, eight accepted example | Same | PASS |
| Evidence limits | One company/codebase; bug-fix concentration; price caveat; scaffold; contamination; task ≠ job | Same | PASS |
| Bug-fix shares | 87.76% IC; 93.58% manager | Same | PASS after Arabic precision revision |
| Five 10X decisions | Task portfolio; two denominators; testing; savings boundary; versioning | Same | PASS |
| Comprehension check | Five equivalent questions | Same | PASS |
| Glossary | Core terms plus post-mitigation | Same | PASS after Arabic revision |
| References | Same four primary sources and dates | Same | PASS |
| Section order | Problem → benchmark → split → original results → update → hypothetical pilot → limits → 10X → check → glossary → conclusion → references | Same | PASS |
| Language naturalness | Original Arabic executive prose | Original English editorial prose | PASS; neither is a line-by-line translation |

### Revisions made for parity and first-use clarity

1. Added the exact IC and manager payout shares to the Arabic dataset breakdown.
2. Added the exact original Diamond per-type payouts to Arabic.
3. Added the unavailable-exact-o1 limitation to Arabic.
4. Replaced rounded bug-fix shares in Arabic with the exact values used in English.
5. Expanded first-use definitions for IC SWE and SWE Manager in Arabic.
6. Standardized foreign-name presentation in key Arabic first uses.
7. Added the post-mitigation glossary entry to Arabic.

### Version-boundary audit

- Original full benchmark: 1,488 tasks and $1,000,000.
- Original Diamond: 502 tasks and $500,800.
- July 2025 offline public IC release: 198 retained tasks, 39 dropped.
- Corrected July combined Diamond maximum: $453,800.
- Corrected deep-research result: 53% and $87,708, IC-only, averaged across three pass@1 runs.
- No numerator is paired with a denominator from another version.
- No exact solved-task count is inferred from the averaged 53%.

### Bilingual parity verdict

The two drafts now preserve the same evidence, claims, dates, denominators, limits, hypothetical status, institutional decisions, glossary concepts, section sequence, and references. Their sentence structure and pacing remain naturally authored in each language. Content parity passes; page-level SEO, components, language switching, TTS, and responsive parity remain publication-stage gates.
