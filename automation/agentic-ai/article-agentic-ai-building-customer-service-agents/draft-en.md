# Can AI Reliably Build a Customer-Service Agent? Evidence from 53 Construction Tasks

Dr. Alaa Mohammad Ahmed

The system looks ready. It answers customer questions, calls the company API, updates records, and passes the tests its developer wrote. Then a routine card-replacement request exposes a missing fee buried in an old document. Another request triggers a retry after a timeout, even though the first write succeeded. The code runs; the service is not safe to ship.

That distinction sits at the center of a September 2026 study from researchers at Sierra and Princeton University. They did not ask whether an AI agent could handle one customer request. They asked whether a coding agent—software that reads project files, writes code, and runs development tools—could build the customer-service agent itself, from scattered business evidence to a working deployment. The delivered system was then tested on customer situations the developer had never seen. [1]

## A construction test, not a chatbot exam

The benchmark is called τ^τ-Bench, pronounced “Hyper-Tau.” It contains 53 construction tasks across four simulated service domains: six airline tasks, six retail tasks, six telecom tasks, and 35 banking tasks.

For each task, the developer agent received the kinds of inputs that complicate a real implementation: operating manuals, support transcripts, spreadsheets, screenshots, recordings, inherited code or neutral stubs, a client-owned REST application programming interface (API), a menu of serving models, and a cost ceiling. An API is the defined channel through which one system reads or changes another system’s data.

Some tasks also included a simulated client who held requirements that were absent from the files. The developer could recover those requirements only by asking questions. Across the four domains, the evidence package contained 2,868 distinct artifacts and more than 5.5 million text tokens, excluding the additional images, PDFs, and recordings. [1][2]

The developer had to infer the rules, decide what to ask, choose an architecture, integrate the API, stay within the average serving-cost budget, and submit an executable customer-service agent. That agent then faced held-out evaluations: simulated customer cases hidden during construction so that the developer could not tune directly to them.

The researchers tested six model-and-harness combinations. Each configuration received one construction attempt on each of the 53 tasks, with an eight-hour wall-clock limit. A benchmark author also built expert reference solutions while knowing the ground-truth requirements. That row is an oracle-like ceiling, not a measurement of an average human engineer.

## The top automated score was 23.9 out of 100

A task score combines the built agent’s mean reward on hidden customer cases with any penalty for exceeding its serving budget. The overall result is the unweighted mean of the 53 task scores.

| Developer configuration | Scores averaged | Mean scored result | Remaining gap to 100 |
|---|---:|---:|---:|
| Claude Opus 5 with Claude Code | 53 task scores | 23.9/100 | 76.1/100 |
| GPT-5.6-sol with Codex | 53 | 22.0/100 | 78.0/100 |
| Kimi K3 with OpenCode | 53 | 17.9/100 | 82.1/100 |
| Expert-authored reference ceiling | the same 53 task positions | 82.2/100 | 17.8/100 |

The 58.3-point difference between the best automated developer and the expert reference is large, but it needs careful language. A score of 23.9 does not mean that roughly 13 of the 53 projects passed. The paper does not publish one aggregate count of all correct and incorrect hidden conversations, and budget penalties can also affect task scores. The denominator is 53 task-level scores; the numerator is an average of 23.9 scored points out of 100.

The same boundary applies to the expert result. It demonstrates that substantially stronger solutions were possible inside the benchmark. It does not show that a typical human team would score 82.2 or that humans outperform AI by a fixed production ratio.

## Complexity changed the picture

The strongest automated configuration produced very different domain averages:

| Domain | Construction-task denominator | Mean scored result | Gap to 100 |
|---|---:|---:|---:|
| Airline | 6 tasks | 55.9/100 | 44.1/100 |
| Retail | 6 | 72.8/100 | 27.2/100 |
| Telecom | 6 | 48.2/100 | 51.8/100 |
| Banking | 35 | 5.9/100 | 94.1/100 |

Banking carried 2,969 atomic policy facts, compared with 85 for airline, 119 for retail, and 155 for telecom. One banking construction task could depend on as many as 580 facts. The authors identify that complexity as a major contributor to the gap.

The aggregate is also shaped by the benchmark mix: banking represents 35 of 53 construction tasks, or 66.0% of the overall task denominator. The domain split is therefore more informative than the headline score alone.

## One result can be counted directly

The paper reports one whole-domain banking example with a raw denominator of 93 held-out cases:

- Correct: 1/93, reported as 1.1%.
- Incorrect: 92/93, approximately 98.9%.

This is the cleanest correct-versus-incorrect count in the study. It is also one banking example, not the total result across all 53 construction tasks. Treating it as the benchmark-wide failure rate would be as misleading as turning 23.9/100 into 13 successful projects.

## The developers searched, but often stopped before understanding

In the whole-domain banking example, each developer opened fewer than 80 files from a corpus of roughly 1,700. They relied on 22 to 53 corpus-wide text searches and built from what those searches returned. The delivered agents then lacked policies that were present in the source material but never surfaced through the chosen keywords. [1]

The simulated client was similarly underused. Conversations with that client represented only 0.3% of recorded developer tool calls; the surrounding text does not print the exact call numerator and denominator. On client-enabled tasks, builds that asked no questions averaged 0.16 reward, while builds that asked four or more averaged 0.50. The paper does not report the two subgroup sizes beside that comparison, so it is an association, not proof that asking four questions causes a threefold improvement in every project.

Architecture exploration was narrow as well. The authors classify 92% of completed builds as a single language-model tool loop, but the exact completed-build denominator is not printed beside the percentage. In a controlled telecom probe, one sentence of architectural guidance—route by intent and review tool calls—raised the score from 31/100 to 67/100. The adjacent text does not state the number of hidden cases in that probe. The bounded conclusion is that an apparently working first design was often not the best design available.

Build effort did not guarantee quality. The strongest automated configuration averaged 216.3 minutes and $42.0 in developer-model API cost per task. GPT-5.6-sol with Codex averaged 47.9 minutes and $18.2; Kimi K3 with Kimi Code averaged 205.7 minutes and $13.5. Those figures use benchmark hardware and listed API prices. They exclude integration, security, human review, incident handling, and remediation.

## Hypothetical case: an agent that approves suppliers

This scenario is hypothetical and was not part of τ^τ-Bench.

An organization asks a coding agent to build a system that receives supplier applications, checks their documents, and updates approval records. The developer reads the procurement manual and the API contract but never asks Compliance about an exception stored outside the main system. Its self-written tests all reflect the requirements it already found. The first unusual production application therefore reaches the wrong outcome without causing a software crash.

The sensible response is neither to reject coding agents nor to accept their output as an autonomous engineering service. The delivered agent should be treated like an untrusted supplier submission. Business owners sign off on a policy inventory. An independent team retains hidden acceptance cases. The API is tested under timeouts, schema drift, and writes that succeed before returning an error. Performance and serving cost are evaluated together. Execution authority expands only after the system stays inside a declared failure boundary.

> **Side study — a different sample and a different question**
>
> Salesforce researchers evaluated finished agents rather than asking a coding agent to build them. CRMArena-Pro contains 19 expert-validated task types across service, sales, and configure-price-quote work. Its synthetic sandbox includes 25 connected Salesforce objects, 29,101 business-to-business records, and 54,569 business-to-consumer records. The authors report about 58% success in single-turn settings and about 35% in multi-turn settings; the abstract does not provide raw success and failure counts for those percentages. The study is therefore supporting evidence that interaction complexity matters, not a directly comparable replication of Hyper-Tau. [3][4]

## What the evidence cannot establish

τ^τ-Bench is a version-one preprint in the cited source. Its organizations, clients, users, records, and traffic are simulated and English-language. The client and user simulators are single language models with fixed requirements and simpler behavior than real stakeholders. Six developer configurations were tested, and each received only one construction attempt per task, leaving build-to-build variance unmeasured.

The sample is also uneven: 35 of 53 tasks are banking. The expert reference had access to ground truth and should not be presented as ordinary human performance. Published build cost is not total ownership cost. None of the results establishes a production defect rate, return on investment, regulatory compliance, or vendor ranking for a specific institution.

## The 10X decision: separate the power to build from the power to ship

The strategic opportunity is not simply faster code. It is a new division of labor in which AI can accelerate construction without becoming the sole judge of whether its own system is ready.

1. **Create an evidence register before code.** Map every policy, fee, exception, data source, and accountable owner.
2. **Turn questions into a required deliverable.** Record what the developer asked stakeholders, what it confirmed, and what remains an assumption.
3. **Keep an independent hidden test suite.** Include routine cases, exceptions, policy conflicts, and irreversible actions that the developer never sees.
4. **Inject operational API failures.** Test committed writes followed by timeouts, delayed completion, schema changes, and retries.
5. **Require design search.** Compare more than one architecture and serving model on quality, latency, and cost instead of accepting the first runnable loop.
6. **Separate deployment authority.** The coding agent may propose code and run tests; a different accountable owner reviews hidden results and authorizes release.
7. **Widen permissions in stages.** Begin with read and recommendation, proceed to reversible updates, and expand only while failures remain inside a declared limit.

This operating model is consistent with the National Institute of Standards and Technology (NIST) AI Risk Management Framework, which calls for defined roles, documented evaluation, monitoring, and incident response across the lifecycle. It is an institutional inference from the evidence and the framework, not a tested intervention bundle from the benchmark. [5]

## Key terms

- **Coding agent:** software that reads a project, writes code, and invokes development tools.
- **Customer-service agent:** software that converses with customers and acts through authorized enterprise tools.
- **Held-out case:** an evaluation case hidden during construction to reduce test-specific optimization.
- **Application programming interface (API):** a defined channel through which software systems exchange requests and data.
- **Ground truth:** the accepted facts and rules used by an evaluation to judge outcomes.
- **Reference ceiling:** the strongest expert-authored solution measured with ground-truth access; not average human performance.
- **Mean score:** the sum of task scores divided by the number of tasks; not a count of completed projects.

## Conclusion

The strongest coding agent in this study produced runnable systems but averaged 23.9/100 across 53 construction tasks, compared with an 82.2/100 expert reference ceiling. In one countable banking example, only 1 of 93 hidden cases succeeded. The simulation does not prove that every AI-built agent will fail. It exposes a more useful management risk: the system that writes the agent may test only what it understood, missing the document it never read, the stakeholder it never questioned, and the failure mode it never imagined. AI can compress construction time; reliable deployment still requires independent evidence, hidden tests, and separate authority to ship.

## References

1. Shi Q, Dhandhania K, Narasimhan K, Barres V. *τ^τ-Bench: An Environment for End-To-End, Realistic Agent Construction*. arXiv:2609.04611v1. 4 September 2026. https://arxiv.org/html/2609.04611v1
2. Sierra Research. *hyper-tau-bench: official code and released tasks*. https://github.com/sierra-research/hyper-tau-bench
3. Huang KH, et al. *CRMArena-Pro: Holistic Assessment of LLM Agents Across Diverse Business Scenarios and Interactions*. arXiv:2505.18878v1. https://arxiv.org/html/2505.18878v1
4. Salesforce AI Research. *Official CRMArena and CRMArena-Pro repository*. https://github.com/SalesforceAIResearch/CRMArena
5. National Institute of Standards and Technology. *AI Risk Management Framework Core*. https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
