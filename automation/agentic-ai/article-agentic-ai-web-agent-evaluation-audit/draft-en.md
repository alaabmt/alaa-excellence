# When a Web Agent Finishes the Job but the Test Says “Failed”: A Human Audit of 165 Tasks
Dr. Alaa Mohammad Ahmed

A browser agent can reach the right report, enter the right dates, and return the requested result—then receive a failing grade because its final answer does not match a rigid string. The opposite failure is equally dangerous: the agent announces success even though it never clicked Save. In either case, the organization has confused a judgment about the work with evidence that the work happened.

A **web agent** is an AI system that turns a goal into browser actions such as searching, clicking, entering data, and submitting a form. An **automatic evaluator** is the rule or model that inspects the result and labels the run successful or failed. Researchers from Techtouch and the Institute of Science Tokyo audited that label rather than taking it at face value. [1]

## The experiment behind the numbers

The team used WebArena-Lite, a resettable simulation containing 165 tasks across shopping, store administration, Reddit, GitLab, and maps. It is a controlled benchmark, not live traffic on the open web. The study ran six experimental conditions and manually audited raw failures from four GPT-5.5 conditions.

A failed run was upgraded only when the recorded environment state, screenshots, action effects, or final response demonstrated that the task requirements had actually been met. An intention was not enough. Neither was a half-completed form or a memory statement contradicted by the page.

Two forms of support were tested:

- **MASM — Memory and Analysis Support Mechanism:** a structured record of what each action changed, what had been verified, what remained blocked, and what should happen next.
- **Guide Text:** procedural evidence about routes, fields, and checkpoints. It supplied a method, not the target answer.

## One run, two scores

The strongest audited condition combined Guide Text and MASM with a maximum budget of 25 browser actions.

| Judgment | Completed | Failed | Meaning |
|---|---:|---:|---|
| Automatic evaluator | 51/165 (30.91%) | 114/165 (69.09%) | Results accepted before audit |
| Human, evidence-grounded audit | 63/165 (38.18%) | 102/165 (61.82%) | Completion verified against the recorded environment |
| Recovered false negatives | 12/165 (7.27 percentage points) | — | Twelve of the 114 raw failures were demonstrated successes |

This is not “GPT-5.5 accuracy.” It is the completion rate for 165 selected benchmark tasks, with one rollout per task, under a 25-action ceiling. The twelve recovered cases also do not make human review infallible. They show that, under the paper's published correction rules, the environment contained evidence of completion that the original evaluator missed.

## What the 102 genuine failures looked like

After correction, 102 runs still failed. Reviewers assigned one primary cause to each failed trajectory.

| Primary failure mode | Count and denominator |
|---|---:|
| Repeated up-and-down scrolling | 32/102 (31.4%) |
| Exploration stopped before completion | 13/102 (12.7%) |
| Final answer produced too early | 13/102 (12.7%) |
| Invalid action format | 9/102 (8.8%) |
| Form or edit workflow left incomplete | 8/102 (7.8%) |
| Other defined causes | 27/102 (26.5%) |

That breakdown is more operationally useful than the headline score. A scrolling loop calls for repeat-action detection. A premature answer calls for a completion gate. A form left unsaved calls for state-change verification. Treating all three as “the model was wrong” would point engineering effort in the wrong direction.

## When memory says 100% and the page disagrees

Structured progress could be extracted for 91/165 tasks (55.2%). Among the 102 failed runs, 18/102 (17.6%) claimed at least 80% completion and 7/102 (6.9%) claimed 100%.

Human review narrowed that optimism sharply. Of 40 analyzable failures that exhausted the action budget, 8/40 (20.0%) reached at least 80% verified progress, while 0/40 (0%) reached verified completion. Agent memory can help investigators find the relevant steps. It cannot certify the outcome.

## Did procedural guidance help?

With 25 actions, MASM alone produced 57/165 verified successes (34.55%). Adding Guide Text produced 63/165 (38.18%): a net increase of six tasks, or 3.64 percentage points.

The net change conceals considerable churn. Outcomes flipped on 34/165 tasks (20.61%). Twenty succeeded only with Guide Text; fourteen succeeded only without it. The paired test did not cross a conventional significance threshold (p=.392), so this sample does not establish a stable, general benefit.

Good guidance did make some successful runs shorter. Across the twenty Guide-only successes, mean actions fell from 15.0 to 8.9, the median fell from 14 to 7, and runs hitting the 25-action limit fell from seven to one. But incomplete guidance also sent agents efficiently toward the wrong page. Faster execution is valuable only when the terminal state is verified.

> **Side evidence — a broader evaluator problem**
>
> AgentRewardBench examined 1,302 expert-reviewed trajectories from five benchmarks and four source LLMs. Rule-based evaluation tended to miss genuine successes, and none of the twelve tested LLM judges led across every benchmark. That separate sample supports the concern that evaluator quality is a system variable, but it does not replace the 165-task audit at the center of this case. [2]

## A hypothetical deployment scenario

**The following example is hypothetical; it was not documented in the study.**

A benefits-portal agent is asked to change a claimant's address. It opens the correct record, enters the new address, and writes, “Update complete.” The organization should not accept that sentence as proof. Completion requires the database to contain the new address, a transaction ID to exist, the save confirmation to appear, no unrelated field to change, and the agent to exit through a valid stop action.

If the address was entered but not saved, the task failed regardless of the agent's confidence. If the address was saved but a brittle text checker rejected the closing sentence, the raw verdict should remain visible while an evidence-backed review records the corrected result. The system must preserve three separate objects: what the agent claimed, what the evaluator decided, and what the environment proves.

## Limits of the evidence

- Each task-condition has one rollout, not a repeated reliability distribution.
- Fifteen- and twenty-five-action conditions are not directly comparable causal experiments.
- The Qwen3.5-9B rows were not human-corrected in the same way as the GPT-5.5 rows.
- Human adjudication remains judgment-based despite fixed evidence rules and second review of ambiguous cases.
- Structured progress was available for only 91/165 tasks.
- Guide Text was observational rather than randomized; 22 tasks had no guide, and guide specificity varied.
- The audit retained one possible state-carryover case and one guide with a leakage risk, flagging rather than removing them.
- API behavior, website state, and authentication can vary between reruns.
- A self-hosted benchmark does not establish reliability or safety on production websites.

## Seven operating decisions through a 10X lens

1. **Define completion in system state.** Every delegated task needs a testable terminal condition: a saved field, submitted record, sent file, or transaction reference.
2. **Keep both verdicts.** Preserve the raw evaluator result beside any evidence-backed correction. The gap is a quality metric for the evaluator.
3. **Install a completion gate.** Before stopping, verify required fields, save or submit events, downstream state, and unintended side effects.
4. **Monitor the path, not only the endpoint.** Detect repeated scrolling, clicking, and searching; escalate when progress plateaus.
5. **Count gains and regressions together.** When procedural guidance is added, record which tasks improve, which deteriorate, and the human maintenance cost.
6. **Pilot in a reversible domain.** Expand autonomy only after repeated success and silent-failure rates are stable, not after one benchmark run.
7. **Match authority with evidence.** More permission to act requires stronger logging, verification, rollback, and human escalation.

## Compact glossary

- **Web agent:** an AI system that executes a sequence of browser actions toward a goal.
- **Automatic evaluator:** a rule or model that judges whether a task run succeeded.
- **False negative:** a completed task incorrectly labeled as failed.
- **Trajectory:** the ordered record of observations, actions, and results in a run.
- **Percentage point:** the direct difference between two rates; 34.55% to 38.18% is about 3.64 percentage points.
- **Statistical significance:** a test of whether an observed difference is distinguishable from random variation under specified assumptions; a non-significant result does not prove no effect, but it limits a strong general claim.

## Conclusion

Reliable delegation cannot rest on an agent's confidence or a single automated label. It requires observable completion conditions, retained execution evidence, disagreement review, and diagnosis of the first consequential error. The 10X move is not to delegate more browser work as quickly as possible. It is to build a system in which every delegated action can be verified, learned from, and reversed.

## References

[1] Gan C, He Z, Tsujii Y, Kobayashi K, Itoh H, Funakoshi K. Auditing Web Agent Evaluation on WebArena-Lite: Human Review of Outcomes and Trajectories. arXiv:2610.01491v1. 1 Oct 2026. https://arxiv.org/html/2610.01491v1

[2] Lù XH, et al. AgentRewardBench: Evaluating Automatic Evaluations of Web Agent Trajectories. arXiv:2504.08942. https://arxiv.org/abs/2504.08942

[3] Zhou S, et al. WebArena: A Realistic Web Environment for Building Autonomous Agents. ICLR 2024; arXiv:2307.13854v4. https://arxiv.org/html/2307.13854v4
