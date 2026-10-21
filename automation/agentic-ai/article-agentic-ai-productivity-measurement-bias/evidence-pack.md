# Evidence Pack — Agentic-AI Productivity Measurement Bias

Accessed/rechecked: 21 October 2026.

| Claim | Direct source | Type | Confidence | Limit |
|---|---|---|---|---|
| Early trial enrolled 16 experienced open-source developers completing 246 real tasks in familiar repositories. | https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/ ; https://arxiv.org/abs/2507.09089 | Primary research report and paper | High for reported design | Participants and repositories were selected; result is not population-wide. |
| AI-allowed tasks took 19% longer; CI +2% to +39%. | Same sources; replication code/data: https://github.com/METR/Measuring-Early-2025-AI-on-Exp-OSS-Devs | Primary estimate with public data/code | High for this sample and specification | Time was self-reported after screen-recorded work; early-2025 tools and mature familiar codebases only. |
| Developers predicted 24% faster before tasks and believed 20% faster afterward. | METR 2025 paper/blog | Primary survey data inside trial | High for participant beliefs | Belief is not measured productivity. |
| Late follow-up had 57 developers, 143 repositories and 800+ tasks; median experience 10 years. | https://metr.org/blog/2026-02-24-uplift-update/ | Primary research update | High for reported sample | “800+” is not an exact released denominator in the article. |
| Returning developers’ raw estimate was 18% faster, CI from 38% faster to 9% slower; new developers 4% faster, CI from 15% faster to 9% slower. | METR 2026 update | Primary raw estimates | Low-medium for effect size | Both intervals include zero; authors call the signal unreliable because of selection and timing problems. |
| 30%–50% of surveyed developers said they withheld some tasks because they did not want no-AI assignment. | METR 2026 update | Primary survey result | Medium | The post does not give the exact survey denominator; report as a range among surveyed participants, never as a fraction of all 57. |
| Pay fell from USD 150/hour to USD 50/hour between studies. | METR 2025 methodology and 2026 update | Primary study-design fact | High | Pay change is a plausible selection contributor, not a quantified cause. |
| Some developers changed task types, output quality, completion behavior or worked concurrently while agents ran. | METR 2026 update | Primary participant feedback/observations | Medium | Mostly qualitative; magnitude is not estimated. |
| Researchers judge the new central estimate likely a bad proxy for real productivity. | METR 2026 update | Authors’ methodological judgment | High for what authors concluded | This is not proof that true speedup is large; it means the estimate is not trustworthy. |
| Automatic benchmark scoring can accept functionally correct agent output that is not usable as-is. | https://metr.org/blog/2025-08-12-research-update-towards-reconciling-slowdown-with-time-horizons/ | Primary follow-up on 18 tasks | Medium | Small selected sample from two repositories; keep in a clearly labeled side box if used. |

## Claim rules

1. Do not headline “AI makes developers 19% slower” without the early-2025 setting.
2. Do not headline “new agents make developers 18% faster”; the authors explicitly reject that reading.
3. Treat confidence intervals as ranges of estimates compatible with the model/data, not the probability that the true value lies there.
4. The 30%–50% range has no published numerator/denominator; explicitly say the source did not provide them.
5. Distinguish task speed from total value: changed task selection, concurrency, documentation, tests and quality can alter the outcome being measured.
6. Use the 18-task benchmark study only as secondary context, visually separated from the main narrative.

## Direct sources

1. Becker J, Rush N, Barnes E, Rein D. Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity. METR, 10 July 2025.
2. Becker J et al. arXiv:2507.09089, version 2, 25 July 2025.
3. METR public dataset and regression code repository.
4. Becker J, Rush N, Cunningham T, Rein D, Mahamud K. We are Changing our Developer Productivity Experiment Design. METR, 24 February 2026.
5. Rein D. Research Update: Algorithmic vs. Holistic Evaluation. METR, 13 August 2025.
