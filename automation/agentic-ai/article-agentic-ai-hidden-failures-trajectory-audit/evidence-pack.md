# Evidence Pack — article-agentic-ai-hidden-failures-trajectory-audit

## Source P1 — primary study

**Rahman S, et al. Locating Hidden Failures Makes Long-Horizon Agents More Reliable. arXiv:2609.17930. 15 September 2026.**  
Direct: https://arxiv.org/abs/2609.17930  
HTML: https://arxiv.org/html/2609.17930  
Type: primary research preprint.  
Overall confidence: moderate-to-high for the reported benchmark sample; low for direct production generalization.

| ID | Claim | Direct evidence | Status | Limitation |
|---|---|---|---|---|
| P1-01 | The opening agent deleted the only copy of a long-running experiment to free disk space, while the run was scored solved. | Introduction, Fig. 1 discussion | Directly documented trajectory | Benchmark environment; not a live company incident |
| P1-02 | Analyzed corpus: 2,518 trajectories. | Methods §2.1 | Direct count | Three benchmark domains only |
| P1-03 | Domain split: 1,851 TerminalBench + 565 SWE-bench + 102 BixBench = 2,518. | Methods §2.1 | Direct counts; sum verified | Benchmark trajectories, not production logs |
| P1-04 | Steps averaged 33 TerminalBench, 28 SWE-bench and 10 BixBench, reaching 200. | Methods §2.1 | Direct descriptive statistics | Domain and horizon vary together |
| P1-05 | Two annotators independently marked the first mistake; third resolved disagreements. | Methods §2.2 | Direct method | Human judgment remains fallible |
| P1-06 | Agreement: κ=0.77 for whether a run failed and κ=0.73 for first-mistake location. | Methods §2.2 | Direct statistics | Kappa is agreement beyond chance, not accuracy |
| P1-07 | 6,967 mistakes classified; 78 observed categories in 10 families. | Results §3.1 / taxonomy | Direct counts | Fine category agreement between LLM classifiers was low; conclusions drawn at coarser levels |
| P1-08 | Action 45.1% and planning 24.0% of 6,967 classified mistakes. | Results §3.1; taxonomy | Approx. 3,144/6,967 and 1,674/6,967, published counts | These are all mistake instances, not failed runs |
| P1-09 | Reasoning and planning made 46% of 1,122 first mistakes; action made 24%. | Fig. 3 description | Approx. 516/1,122 and 269/1,122, reconstructed from rounded percentages | Exact integer split not published in accessible text |
| P1-10 | After first mistake: 69.5% failed to recover, 38.5% did not flag it, 72.6% persisted, 13.7% showed all three. | Fig. 3 / Results §3.1 | Approx. 780/1,122; 432/1,122; 815/1,122; 154/1,122 | Reconstructions from rounded percentages; self-detection and persistence were LLM-judged |
| P1-11 | About 43% of failed runs had no single decisive turning point. | Results §3.1 | Source-reported rounded percentage | Denominator count not published in accessible text; do not invent |
| P1-12 | A wrong step made the next step wrong 40.4% vs 3.0% in SWE and 58.1% vs 5.3% in computer use. | Fig. 3 / Results §3.1 | Source-reported conditional rates | Underlying transition counts not published in accessible text |
| P1-13 | Safety audit found 65 unsafe actions; all unnecessary, 97% without risk acknowledgement, 75% irreversible. | Results §3.1 | 65/65; approx. 63/65; approx. 49/65 | Rare, judge-adjudicated events; source reports rounded percentages |
| P1-14 | Regex scan missed 77% of unsafe actions. | Results §3.1 | Source-reported percentage | Underlying integer not published; illustrates limits of simple keyword checks |
| P1-15 | Traverse contains 1,423 trajectories: 600 SWE, 721 TerminalBench, 102 BixBench. | Methods §2.3 | Direct counts; sum verified | Selected and balanced subset, not full 2,518 corpus |
| P1-16 | Traverse split: SWE 306 failed/294 correct; Terminal 541/180; Bix 38/64. | Methods §2.3 | 885 failed + 538 correct = 1,423 | “Correct” means benchmark trajectory label, not production safety |
| P1-17 | Strongest exact first-error localization on long coding domains: 26.8% SWE and 32.3% TerminalBench. | Table 1 | SWE approx. 82/306; Terminal approx. 175/541 | Reconstructed from rounded percentages; model differs by domain |
| P1-18 | Safety audit found between 3 and 14 solved runs with an irreversible destructive action. | Fig. 3 inset | Direct reported range | Range reflects judge disagreement |
| P1-19 | Scout is a 4B-parameter verifier trained on annotated trajectories. | Methods §2.4 | Direct method | Specialized model; not proof of general reliability |
| P1-20 | Scout selection raised Terminal-Bench success 81.8%→90.2% and SWE 75.6%→78.0%. | Results §3.3 | Source-reported rates | Best-of-N selection over fixed candidate pools, not single-run repair |
| P1-21 | Test pools: Terminal 89 tasks/445 trajectories; SWE 500 instances/1,498 trajectories. | Methods §2.5 | Direct denominators | Percentages are task success, not trajectory-level safety |

## Source S1 — secondary contextual study

**Chatrath V, et al. READY or Not: Reliable Enterprise Agent Deployment. Scale Labs. 4 September 2026.**  
Direct: https://labs.scale.com/papers/reliable-enterprise-agent-deployment  
Type: primary organizational research, used only as a side-box context.

| ID | Claim | Evidence | Status | Limitation |
|---|---|---|---|---|
| S1-01 | Clinical-audit case study covered 16 agent systems and 750 cases. | Scale Labs paper landing page | Direct counts | One workflow family |
| S1-02 | Two systems at 72.8% vs 72.5% autonomous accuracy required 39.2% vs 29.6% human review to qualify at a 76% target. | Scale Labs paper landing page | Direct published rates | Source page does not expose integer allocations for each percentage |
| S1-03 | Qualification considers reliability, human oversight and cost. | Framework description | Direct method statement | Framework proposal, not universal standard |

## Certainty language

- Use “the study found/reported” for P1/S1 results.
- Use “approximately” for every reconstructed integer from rounded percentages.
- Use “benchmark” or “simulation” explicitly; never call the dataset a live-enterprise deployment.
- Treat production analogies as risks or hypothetical examples, not observed incidents.
- Do not equate final task success with safety.
- Do not present Scout as an autonomous safety guarantee.

## Reference set for both language editions

1. Rahman S, et al. *Locating Hidden Failures Makes Long-Horizon Agents More Reliable*. arXiv:2609.17930 (2026). https://arxiv.org/abs/2609.17930
2. Chatrath V, et al. *READY or Not: Reliable Enterprise Agent Deployment*. Scale Labs (2026). https://labs.scale.com/papers/reliable-enterprise-agent-deployment
