# When Developers Do Not Want to Work Without AI: Why Productivity Became Harder to Measure

Dr. Alaa Mohammad Ahmed

A software leader wants evidence before expanding coding agents. The proposed test sounds clean: let developers use AI on half their tasks, prohibit it on the other half, and compare completion times.

But what if some developers decline because they no longer want to do half their work without an agent? What if they withhold the tasks where they expect AI to help most? The experiment no longer measures the whole job. It measures what remains after the most AI-dependent people and tasks have selected themselves out.

That is the problem METR—Model Evaluation and Threat Research, a nonprofit that evaluates advanced AI systems—encountered across two rounds of field research. Its 2025 randomized trial produced a surprising result: early-2025 tools slowed 16 experienced developers in a specific setting. When the researchers tried to update that estimate with newer agentic tools, adoption itself changed the work enough to weaken the old comparison.

## What counts as an agentic coding tool here?

An agentic coding tool does more than answer a question. It can inspect project files, propose coordinated edits, run commands and tests, examine failures and try again. Participants in the first study mainly used Cursor Pro with Claude 3.5 or 3.7 Sonnet. By the follow-up, tools such as Claude Code and Codex were becoming more common.

The possible value is therefore not limited to typing code faster. An agent can absorb parts of search, implementation and testing. Once developers run several agents while doing other work, “time on this task” stops being a simple measure of human effort.

## What the first trial actually measured

Between February and June 2025, METR recruited 16 experienced contributors to open-source projects they knew well. They had worked in those repositories for about five years on average and supplied 246 real issues worth completing: bug fixes, features and refactors.

This was a randomized controlled trial (RCT): each issue was randomly assigned to either allow or disallow generative AI. The same developer completed tasks in both conditions, recorded the screen and reported implementation time. That design compared each person partly against their own performance rather than comparing two entirely different groups. [1][2]

### From sample to result

| Measure | Numerator or estimate | Denominator or comparison base |
|---|---:|---|
| Participants | 16 developers | 16 analyzed participants |
| Completed issues | 246 | 246 valid completed issues |
| Estimated AI-allowed effect | 19% more time | No-AI time = 100% |
| Confidence interval | 2% to 39% more time | No effect = 0% |
| Developers’ forecast before work | 24% less time | No-AI time = 100% |
| Their estimate after the study | 20% less time | No-AI time = 100% |

A confidence interval is a range of effect estimates reasonably compatible with the data and statistical model. It does not mean every task slowed by an amount inside that range, nor is it a direct probability that the true value lies there. The central estimate was a 19% increase in time when AI was allowed, with the reported range running from 2% to 39% more time. [1][2][3]

The perception gap was just as important. Developers expected a 24% speedup beforehand and still believed they had gained 20% afterward. The measured estimate pointed in the opposite direction. The 39-percentage-point gap is a difference between a belief and an estimated time effect, not a separate error rate.

This does not show that AI coding tools slow every developer. It describes early-2025 tools, expert maintainers, mature familiar repositories and tasks averaging roughly two hours.

## What happened when METR tried again?

A second experiment began in August 2025 with broader adoption and newer agents. The released update covers 57 developers—10 returning and 47 newly recruited—across 143 repositories and more than 800 tasks. Median developer experience was ten years. [4]

The raw estimates looked more favorable:

| Group | Central estimate | Confidence interval | Scientific reading |
|---|---:|---:|---|
| 10 returning developers | 18% less time | 38% less to 9% more | Does not establish a speedup |
| 47 new developers | 4% less time | 15% less to 9% more | Does not establish a speedup |

Both intervals include zero effect and slowdown. More importantly, METR itself described the signal as unreliable and the central estimate as likely a poor proxy for AI’s real productivity impact. The table cannot support a headline that newer agents made developers 18% faster. [4]

## Why the measurement began to fail

The problem was not one bad number. The work had changed.

### Likely high-benefit users selected themselves out

Recruitment and retention became harder as more developers said they did not want a 50% chance of working without AI. The sample may therefore miss some of the heaviest adopters and most optimistic users.

### High-benefit tasks disappeared before randomization

Between 30% and 50% of developers who answered METR’s survey said they withheld some tasks because they did not want those tasks assigned to the no-AI condition. The source does not publish the precise numerator and denominator for this question, so the range must not be presented as a fraction of all 57 participants. It is nevertheless direct evidence of selection bias: the measured tasks can differ systematically from the omitted ones. [4]

### Task type and output quality changed

Some participants said they attempted different work with agents or produced more documentation and tests. If the output changes, minutes alone no longer compare like with like.

### Human time and machine time overlapped

A developer could work on something else while an agent ran. With multiple agents, elapsed time, machine runtime and active human minutes become three different quantities.

### Completion changed with the condition

Participants were less likely to finish some tasks assigned to the no-AI condition; one developer completed none of those assigned tasks. Comparing only finished tasks can therefore remove part of the effect from the analysis.

## Side note: passing tests is not the same as usable work

In a separate study of only 18 tasks from two repositories, METR compared automatic test success with broader human review. Agents sometimes produced functionally correct code that was not ready to use because of missing tests, formatting or general quality problems. The selected sample is too small to estimate agent accuracy in general. It does show why an automated benchmark can overstate operational value. [5]

## A hypothetical enterprise pilot that does not lose the changed work

**The following example is hypothetical; it is not part of METR’s studies.**

A technology group with 12 developers pilots a coding agent for eight weeks. Instead of recording only the duration of completed tasks, it captures:

- elapsed time from accepted request to approved change;
- active human minutes;
- agent runtime and concurrent-agent count;
- completed, abandoned and withheld tasks;
- review cycles and rework;
- tests, documentation and defect outcomes;
- work that the team would not have attempted without the agent;
- tool, review and security costs.

It also asks which tasks employees kept out of the trial and why. That makes task selection and concurrency part of the evidence instead of invisible loss.

## Limits of the evidence

The first trial is comparatively strong within its setting because it randomized real work and released data and code. It is still small, time-bound and specific to selected experts, tools and repositories. Implementation time was self-reported, although work sessions were recorded.

The second effort is larger in people, repositories and tasks but weaker as an effect estimate. Participation, task submission, pay—reduced from $150 to $50 per hour—concurrency, output quality and completion all changed. The published evidence cannot quantify the resulting bias or recover the true speedup.

Neither study alone measures long-term maintainability, production failures, the development of junior staff or the value of entirely new work that agents make economical.

## The 10X Lens: measure system capability, not an old task timer

A 10X transformation is not a fixed percentage shaved from yesterday’s task. An agent may change which work is chosen, how many jobs run in parallel, how much testing is produced and where expert judgment is concentrated.

That leaves leaders with three decisions:

1. **Define value before selecting the tool.** Is the goal lower cycle time, more completed work, higher quality or work that was previously uneconomic?
2. **Measure the complete system.** Separate active human time from machine runtime; count abandonment, rework, quality and omitted tasks—not only successful completions.
3. **Redesign the experiment when the work changes.** If prohibiting the agent no longer represents normal work, compare teams, time periods or complete workflows under clear controls instead of forcing every task back into a disappearing operating model.

The useful number is not a universal speedup. It is the net change in value after quality, risk, cost, new work and the redistribution of human and machine effort are included.

## Key terms

- **Randomized controlled trial (RCT):** random assignment to different conditions to estimate an intervention’s effect.
- **Agentic coding tool:** a system that inspects a project, uses tools and carries out multiple steps toward a software goal.
- **Confidence interval:** an estimated range expressing statistical uncertainty around an effect.
- **Selection bias:** a systematic difference between what enters a measurement and what remains outside it.
- **Refactor:** reorganizing code without changing its intended behavior.

## The question that remains

If an agent changes which tasks your team chooses and how work is divided between people and machines, does your productivity dashboard measure that new value—or only the minutes of an operating model that is beginning to disappear?

## References

1. Becker J, Rush N, Barnes E, Rein D. Measuring the Impact of Early-2025 AI on Experienced Open-Source Developer Productivity. METR, 10 July 2025. https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/
2. Becker J, Rush N, Barnes E, Rein D. arXiv:2507.09089, version 2, 25 July 2025. https://arxiv.org/abs/2507.09089
3. METR. Anonymized data and core regression code. https://github.com/METR/Measuring-Early-2025-AI-on-Exp-OSS-Devs
4. Becker J, Rush N, Cunningham T, Rein D, Mahamud K. We are Changing our Developer Productivity Experiment Design. METR, 24 February 2026. https://metr.org/blog/2026-02-24-uplift-update/
5. Rein D. Research Update: Algorithmic vs. Holistic Evaluation. METR, 13 August 2025. https://metr.org/blog/2025-08-12-research-update-towards-reconciling-slowdown-with-time-horizons/

## Editorial disclaimer

The views and analysis presented represent the author’s professional interpretation based on the cited sources and do not necessarily represent the official positions of the organizations mentioned. Consult the original sources and documents for complete and current information.
