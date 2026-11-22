# Can an AI Agent Complete Paid Software Work? Evidence from $1 Million in Real Freelance Tasks

**Dr. Alaa Mohammad Ahmed**

A software team rarely faces a neat prompt with one correct function to write. It faces a broken permission flow, a slow page, a mobile bug that only appears after several steps, or a feature that must work across web, iOS, Android, and desktop. An AI assistant can produce plausible code quickly. The harder question is whether that code repairs the real system and survives the same user journey that exposed the problem.

SWE-Lancer was designed around that harder question. The benchmark—an organized test used to compare model performance—contains 1,488 historical freelance software tasks linked to Expensify’s open-source codebase and posted on Upwork. The tasks carried exactly $1 million in past payouts.

That economic grounding makes the benchmark unusual. It does not estimate what a task might be worth. Instead, it assigns benchmark credit equal to what a freelancer was historically paid for the task a model completes. The model does not receive wages, and the score is not realized savings. It is a way to connect technical performance to work that had market value.

The original result is sobering: even the strongest model tested in the ICML 2025 paper failed most tasks.

## Two jobs inside one benchmark

SWE-Lancer evaluates two distinct forms of work.

**Individual-contributor software engineering (IC SWE)** asks an agent to change code. The model receives the issue description, a snapshot of the codebase before the fix, and a goal. Its patch is then tested through end-to-end workflows. These 764 tasks account for $414,775 in historical payouts.

An **agent** here is more than a one-shot chatbot. It can inspect files, use tools, modify the repository, and take several steps toward a goal. An **end-to-end test** checks the user’s complete journey across the system rather than testing one isolated function.

**Software-engineering management (SWE Manager)** asks for a decision rather than a patch. The model reviews multiple real implementation proposals and chooses the best one. Its choice is compared with the option selected by the original engineering manager. These 724 tasks account for $585,225.

The researchers paid a team of 100 professional engineers to write and verify the IC tests. Each end-to-end test suite went through three rounds of review, and an automated check confirmed that it passed after the real fix and failed before it. For management tasks, a separate expert validation campaign agreed with the historical choices 99% of the time.

The arithmetic closes exactly:

- 764 IC tasks plus 724 manager tasks equals 1,488.
- $414,775 plus $585,225 equals $1,000,000.
- IC work represents 51.34% of tasks but 41.48% of payout.
- Management represents 48.66% of tasks but 58.52% of payout.

## The public Diamond split was one-third of tasks—and half of value

The full benchmark was not released publicly. The researchers retained a private holdout to reduce the risk that models could retrieve known solutions from training data or web search.

The public set, SWE-Lancer Diamond, originally contained 502 tasks:

- 237 IC tasks worth $236,300;
- 265 manager tasks worth $264,500;
- $500,800 in total historical payout.

Diamond therefore represented 33.74% of all tasks but 50.08% of all payout. Calling it “half the benchmark” would be misleading: it was roughly one-third of the task count and half of the economic denominator.

## What the original paper found

In the original ICML/PMLR results, Claude 3.5 Sonnet performed best on the combined Diamond set. It:

- passed 36.1% of tasks;
- earned about $208,000 in benchmark credit out of $500,800;
- captured 41.5% of the available payout value.

OpenAI o1 at high reasoning effort passed 29.7% and captured 33.1% of payout value—about $166,000. GPT-4o passed 23.3% and captured 27.7%—about $139,000.

The difference between pass rate and earn rate matters. Prices were uneven. Solving several inexpensive issues could raise task accuracy without adding much payout credit, while one difficult high-value task could do the reverse. The benchmark therefore needs both numerators: accepted tasks and historical payout attached to them.

The two job types also produced very different results. On Diamond’s code-writing tasks, Claude 3.5 Sonnet passed 26.2%. On manager-selection tasks, it reached 44.9%. Choosing among ready proposals was materially easier than producing a patch that survived end-to-end testing.

Across the complete 1,488-task benchmark, Claude 3.5 Sonnet passed 33.7% and captured 40.3% of the $1 million payout pool—about $403,000. Most work remained unsolved.

The paper reports several dollar values rounded to the nearest thousand, while its percentages use unrounded values. Small discrepancies from dividing the displayed rounded numbers are therefore expected.

## A July 2025 update changed the denominator

The benchmark changed after the paper’s initial results. On July 17, 2025, OpenAI released an updated evaluation that removed the requirement for internet access during execution and addressed issues affecting the dollars-earned calculation.

Of the original 237 public IC tasks, 198 were adjusted and verified to run offline. The remaining 39 were dropped. That is 16.46% of the original public IC set.

The corrected Diamond maximum payout reported by OpenAI fell from $500,800 to $453,800. This creates a strict version rule: a result from the revised benchmark cannot be divided by the original denominator.

In a July 28, 2025 update to the Deep Research System Card, OpenAI reported a corrected result for the post-mitigation deep research model with browsing. On IC tasks it:

- averaged a 53% solve rate across three pass@1 runs;
- earned exactly $87,708 in historical-payout credit.

**Pass@1** means one attempt per task. OpenAI ran that one-attempt evaluation three times and averaged the run-level outcomes. The 53% result therefore should not be converted into a claim that the model solved an exact integer such as 105 tasks.

The $87,708 numerator is IC-only. The $453,800 figure is the revised maximum for the combined Diamond evaluation. Dividing one by the other would not produce a valid IC earn rate. The accessible primary text does not state the revised IC payout denominator separately.

OpenAI also said the browsing model earned nearly twice as much as o1, but did not provide an exact revised o1 dollar figure in the text used here. “Nearly twice” cannot be reverse-engineered into a precise number.

## A hypothetical institutional pilot

The following example is hypothetical and was not part of SWE-Lancer.

Imagine a public-sector organization with 100 maintenance tickets for the quarter. A responsible pilot would not hand all 100 to an agent and announce automation. It could instead:

1. select 20 low-risk tickets with clear acceptance criteria;
2. run the agent in an isolated copy of the environment;
3. require an end-to-end test for every user-facing change;
4. add security, performance, and regression checks;
5. require human review before merging code;
6. measure accepted tasks, reviewer time, returned defects, incidents, and verified economic benefit.

If eight of 20 patches are accepted, “40% accuracy” is only the beginning. Leaders need to know which task types succeeded, whether expensive tasks behaved differently, how much human repair was needed, and whether risk shifted downstream.

## What the benchmark does not prove

SWE-Lancer is more realistic than a short coding quiz, but it is not a model of the entire software economy.

First, every task came from one company and an established codebase. The benchmark does not cover all languages, organizations, regulated environments, or greenfield product development.

Second, the workload is dominated by bug fixing. In the original Diamond split, 87.76% of IC tasks and 93.58% of manager tasks were bug fixes. That makes the benchmark especially relevant to maintenance work, but less representative of invention from a blank page.

Third, historical price is not a pure measure of technical difficulty. Urgency, negotiation, elapsed time, and scarce expertise can all influence payout. Price is a real economic signal, not a direct measure of labor hours or salary.

Fourth, the surrounding scaffold matters. Tool access, reasoning effort, browsing, execution time, and grading infrastructure can change measured performance. The July update itself demonstrates that evaluation engineering can alter results without the model alone being responsible.

Fifth, open-source evaluations carry contamination risk. A browsing model may encounter related discussions or solutions online. OpenAI reported that manual inspection did not find task-specific solution searching by the deep research models, but manual review cannot prove zero contamination.

Finally, passing bounded tasks does not equal automating a job. Jobs also require prioritization, communication, accountability, security judgment, incident response, and learning the institution’s context.

## The 10X lens: five decisions for leaders

### 1. Build a task portfolio, not a single headline score

Separate fixes, new features, review decisions, and reliability work. Report performance by task type so a strong result in proposal selection does not hide weak patch-writing performance.

### 2. Publish two denominators

Every pilot should report accepted tasks out of attempted tasks and verified value out of total available value. Either metric alone can distort the operational picture.

### 3. Make tests an approval gate

Plausible code is not evidence. Require end-to-end user journeys, security checks, performance checks, regression tests, and risk-based human review.

### 4. Keep benchmark credit separate from realized savings

A model earning $87,708 in SWE-Lancer credit does not mean an organization saved $87,708. Real savings must subtract model use, integration, human review, rework, failures, and incidents.

### 5. Version every comparison

A trustworthy dashboard records dataset version, task count, payout denominator, model, scaffold, tool access, and run date. Comparing the original $500,800 Diamond result with the corrected $453,800 evaluation without those labels can produce a false trend.

## 20-second comprehension check

- **What did SWE-Lancer test?** AI systems on 1,488 real historical software tasks with $1 million in past payouts.
- **Did models receive money from Upwork?** No. They received benchmark credit equal to the historical payout of passed tasks.
- **Did the original leading model solve most tasks?** No. It passed 36.1% of combined Diamond and 33.7% of the full set.
- **Does 53% describe all 1,488 tasks?** No. It is a corrected July 2025 result for IC tasks, averaged across three pass@1 runs.
- **Does the study prove engineer replacement?** No. It demonstrates partial, uneven task capability inside a bounded evaluation.

## Glossary

- **Agentic AI:** an AI system that takes multiple steps and uses tools in an environment to pursue a goal.
- **IC SWE:** individual-contributor tasks requiring a code patch.
- **SWE Manager:** tasks requiring selection of the best technical proposal.
- **Pass@1:** success with one attempt per task.
- **E2E test:** an end-to-end test of a complete user workflow.
- **Diamond:** the public evaluation split.
- **Denominator:** the total task count or value against which a percentage is calculated.
- **Payout credit:** benchmark value based on historical freelance payouts, not new wages paid to the model.
- **Post-mitigation:** the model configuration after OpenAI’s stated improvements or safeguards.

## Conclusion

SWE-Lancer moves the coding-agent debate from demonstrations to accountable work. It asks whether an agent can repair a real system, survive a full user workflow, and capture value attached to work that humans were once paid to complete.

The evidence supports neither dismissal nor hype. Agents achieved meaningful performance, yet the original leading model still failed most tasks. The corrected July result shows substantial progress in one task family under a revised evaluation, not the automation of an occupation.

The 10X opportunity is therefore not to remove human responsibility. It is to combine agent speed with strong testing, explicit denominators, human accountability, and honest economic measurement.

## References

1. Miserendino, S., Wang, M., Patwardhan, T., & Heidecke, J. (2025). *SWE-Lancer: Can Frontier LLMs Earn $1 Million from Real-World Freelance Software Engineering?* Proceedings of the 42nd International Conference on Machine Learning, PMLR 267:44412–44450. https://proceedings.mlr.press/v267/miserendino25a.html
2. OpenAI. *SWE-Lancer*. https://openai.com/index/swe-lancer/
3. OpenAI. *Frontier Evals — SWE-Lancer README*. Updated July 17, 2025. https://github.com/openai/frontier-evals/blob/main/project/swelancer/README.md
4. OpenAI. *Deep Research System Card — Ability to Run Code*. SWE-Lancer note updated July 28, 2025. https://deploymentsafety.openai.com/deep-research/ability-to-run-code
