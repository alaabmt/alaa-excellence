# Metrics Check — Agentic-AI Productivity Measurement Bias

## Early-2025 controlled field trial

| Measure | Numerator / estimate | Denominator / comparison base | Interpretation |
|---|---:|---:|---|
| Developers | 16 | 16 enrolled participants in analyzed trial | Small, experienced, selected sample |
| Completed tasks | 246 | 246 valid completed issues | Real repository work |
| Estimated time effect | +19% | Expected time without AI = 100% | AI-allowed time estimated at 119% of no-AI time |
| 95% confidence interval | +2% to +39% | Zero effect = 0% | Interval excludes zero under reported model |
| Pre-task belief | −24% time | No-AI time = 100% | Participants expected AI time of 76% |
| Post-study belief | −20% time | No-AI time = 100% | Participants believed AI time was 80% |
| Belief-versus-measurement gap | 39 percentage points | −20% believed vs +19% measured | Difference in direction and magnitude, not a separate causal estimate |

The public regression repository reports 0.188, rounded editorially to 19%, with intervals approximately 0.013–0.395 depending on standard-error specification.

## Late-2025 follow-up reported February 2026

| Measure | Numerator / estimate | Denominator / comparison base | Interpretation |
|---|---:|---:|---|
| Developers | 57 | 10 returning + 47 new | Exact participant total |
| Repositories | 143 | 143 included repositories | Exact reported count |
| Tasks | 800+ | Exact denominator not published in post | Never convert to a precise rate |
| Returning-developer estimate | −18% time | No-AI time = 100% | Raw estimate suggests speedup |
| Returning CI | −38% to +9% | Zero effect = 0% | Includes no effect and slowdown |
| New-developer estimate | −4% time | No-AI time = 100% | Raw estimate suggests small speedup |
| New-developer CI | −15% to +9% | Zero effect = 0% | Includes no effect and slowdown |
| Surveyed developers withholding tasks | 30%–50% | Survey denominator not disclosed | Report only as source’s range |
| Pay | USD 50/hour | Prior trial USD 150/hour | Design difference; not a measured cause |

## Correct/incorrect interpretation table

| Statement | Status | Why |
|---|---|---|
| “Early-2025 AI slowed these developers by an estimated 19% in this setting.” | Correct | Preserves sample, time and context. |
| “AI makes developers 19% slower.” | Incorrect | Overgeneralizes beyond tools, people, tasks and date. |
| “Late-2025 agents made returning developers 18% faster.” | Incorrect | Raw interval includes slowdown and authors judge estimate unreliable. |
| “The later study proves AI became faster.” | Incorrect | Selection effects prevent a credible causal estimate. |
| “The study shows productivity measurement must include task selection and concurrent work.” | Supported analytical inference | Directly grounded in disclosed measurement failures. |
| “30%–50% of all 57 developers withheld tasks.” | Unsupported | The survey denominator was not published. |

## Gate

PASS for publication only if the article makes the methodological conclusion central and never markets the raw late-study estimates as measured productivity gains.
