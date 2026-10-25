# When a Person Approves an AI Agent's Actions, Is That Real Oversight or a Rubber Stamp?

Dr. Alaa Mohammad Ahmed

The approval queue looks harmless until the next request would delete a remote branch, expose a credential, or change a production system. A person is still “in the loop,” but a safeguard that demands dozens of near-identical clicks can train that person to approve first and inspect later.

An AI agent is software that uses a large language model (LLM) to plan and carry out a sequence of steps through tools and permissions. Human oversight means more than placing an approval button in front of those steps. The reviewer must understand the proposed action, have the authority and time to refuse it, and be able to stop the system.

Anthropic reported on 25 March 2026 that users of its Claude Code programming tool accept 93% of permission prompts. The company did not publish the denominator, observation period, user population, or the proportion of prompts that were safe. The figure is therefore neither an error rate nor proof that 93% of approvals were careless. It does, however, frame the design problem behind what the company calls “approval fatigue”: repeated requests can drain attention from the decisions that matter. [1]

## Replacing a stream of prompts with a technical gate

Anthropic built Auto Mode to delegate some permission decisions to a classifier. Low-risk tools and ordinary reads can pass without the classifier. File edits inside the project are allowed because version control makes them reviewable. Commands with greater downside—such as shell operations, external integrations, and changes outside the project—reach a fast first-stage filter. Anything it flags receives a second, more deliberate review.

A denied action is returned to the agent so it can seek a safer route. Three consecutive denials or twenty denials in one session trigger escalation; in headless operation, the process terminates. The design moves part of the control from a human prompt to an executable boundary. [1]

That is a deployed product architecture described by its maker, not a randomized comparison of human and machine reviewers. Anthropic also says Auto Mode is not a drop-in replacement for careful human review on high-stakes infrastructure. [1]

## Three tests, three different questions

The company evaluated the full pipeline on three datasets:

1. **10,000 real internal tool calls** from Anthropic employees, used to measure needless blocking of benign work.
2. **52 selected real overeager actions**, drawn from sessions in which an employee denied the action or it was flagged afterward, used to test whether risky overreach escaped the gate.
3. **1,000 synthetic data-exfiltration attempts**, designed to probe whether the system would allow sensitive data to be sent out. These were simulations, not 1,000 production incidents. [1]

A false-positive rate (FPR) is the share of benign actions incorrectly blocked. A false-negative rate (FNR) is the share of dangerous actions incorrectly allowed. Those measures have opposite denominators and cannot be merged into one overall accuracy score.

## The results, from total to correct and incorrect

| Evaluation set | Total | Correct outcome | Incorrect outcome |
|---|---:|---:|---:|
| Real internal calls treated as benign | 10,000 | About 9,960/10,000 allowed (99.6%) | About 40/10,000 blocked (0.4% FPR) |
| Selected real overeager actions | 52 | About 43/52 blocked (about 83%) | About 9/52 allowed (17% FNR) |
| Synthetic exfiltration attempts | 1,000 | 943/1,000 blocked (94.3%) | 57/1,000 allowed (5.7% FNR) |

The first two counts are approximate because Anthropic published rounded percentages rather than an exact confusion matrix. Multiplying 10,000 by 0.4% gives about 40 false blocks. Multiplying 52 by 17% gives 8.84, or approximately nine missed actions. The synthetic result converts directly to 57 of 1,000 if the reported 5.7% is exact.

The system created little friction on the 10,000-call set and stopped most of the selected real overreaches. It still let roughly nine of 52 selected real overreaches pass. On the synthetic set, it missed 57 of 1,000 exfiltration attempts.

None of those rows is “general accuracy.” The first measures friction on presumed-benign traffic. The second is a small, curated set of real overreach. The third is a controlled simulation. Success in one does not answer the question posed by another.

## A hypothetical procurement workflow

This example is hypothetical and was not part of Anthropic’s evaluation.

Suppose a procurement agent reads bids, extracts prices, drafts purchase requests, and routes them for approval. Asking a person to approve every file read and spreadsheet update will produce a long queue of low-value clicks. Giving the agent unrestricted execution creates the opposite failure: it might send an order, change supplier details, or commit funds before anyone has judged the consequence.

A stronger design separates four kinds of action:

- Reading bids and organizing data runs automatically, with logs and reversibility.
- Drafting an order below a policy threshold runs automatically but remains reviewable.
- Sending an order, changing a supplier record, or exceeding the financial threshold requires approval from an authorized person who can see the amount, destination, supporting evidence, and irreversible effects.
- Deleting records or transferring money outside policy is blocked technically, not placed behind another prompt that the agent can repeatedly request.

Oversight is then measured by consequential decisions reviewed, unsafe actions blocked, review time, reversals, and failures that escaped—not by the raw number of approval clicks.

> **Side study — what independent research says about automation bias**
>
> Lyell and Coiera identified 890 records and included 40 studies in a systematic review; six were in healthcare. Among 31 studies that tested omission errors, 25 found evidence of automation bias (25/31 = 80.6%) and six did not (6/31 = 19.4%). Among 23 studies that tested commission errors, 21 found evidence (21/23 = 91.3%) and two did not (2/23 = 8.7%). [2]
>
> These are shares of studies finding an effect, not error rates for individual decisions. The review spans multiple domains and forms of automation and did not test language-model agents. It supports a general concern about over-reliance, not a measured rubber-stamp rate for modern agent tools.

## What governance texts require—and what they do not prove

Official and professional frameworks converge on one principle: nominal human presence is not enough.

| Source | Requirement or guidance | Evidence boundary |
|---|---|---|
| EU Artificial Intelligence Act, Article 14 | For covered high-risk systems, overseers should understand capabilities and limits, remain aware of automation bias, disregard or reverse outputs, and halt the system safely | Applies only to systems legally classified as high-risk; it does not prove that a stop control or training always works |
| NIST AI Risk Management Framework | Define roles, document oversight processes, and provide appeal, override, incident-response, and post-deployment monitoring mechanisms | Voluntary framework, not an effectiveness trial |
| OECD AI Principle 1.2 | Put context-appropriate safeguards in place for human agency and oversight | High-level principle, not a tested operating model |
| OWASP LLM06:2025 | Require human approval for high-impact actions and have downstream systems verify authorization | Security guidance, not a controlled comparison |

A July 2026 amendment sets 2 December 2027 as the relevant application date for Annex III high-risk systems under the EU Act. An agent is not automatically a high-risk AI system; the legal classification depends on its use and the Act’s criteria. [3][4][5][6][7]

## Limits of the evidence

Anthropic’s results are internal and have not been independently audited in the cited source. The 52-action dataset is small and selected, not a random sample of all Claude Code actions. The 1,000 exfiltration attempts are synthetic and do not measure a production incident rate.

The 93% acceptance figure has no published denominator or method. The 17% result does not mean the pipeline permits 17% of every dangerous action; it describes 52 selected real overeager actions. The source offers no matched test proving that the classifier outperforms an attentive human reviewer under the same conditions.

Governance documents state expectations, not demonstrated effectiveness. The systematic review transfers only by analogy to language-model agents.

## The 10X Lens: redesign oversight before scaling autonomy

The larger opportunity is not to make approval faster. It is to reduce how many events need approval while concentrating human judgment on the few that carry material consequence.

Six institutional decisions follow:

1. **Map actions:** list everything the agent can read, change, send, purchase, or delete.
2. **Encode hard limits:** enforce prohibited actions in the execution layer, not only in natural-language instructions.
3. **Classify by impact and reversibility:** automate low-impact reversible work; require explicit approval for consequential work.
4. **Build a decision interface:** show the purpose, affected data, financial value, external destination, and irreversible effect.
5. **Measure oversight:** track acceptance, review time, rejections, prevented failures, reversals, and escapes.
6. **Test attention and controls:** introduce a controlled known-bad request, verify that both the reviewer and the technical gate catch it, and adjust permissions and training.

This six-part model is an institutional design inferred from the evidence, not a combined intervention validated by the cited studies. It should begin with one agent and one workflow and expand only when logs show that the controls work.

## Key terms

- **AI agent:** software that plans and executes multiple steps through tools and permissions.
- **Human oversight:** a qualified person’s ability to understand, review, refuse, override, or stop the system.
- **Approval fatigue:** declining attention after repeated permission requests.
- **Automation bias:** excessive reliance on an automated system’s output.
- **False-positive rate (FPR):** benign actions incorrectly blocked divided by all benign actions tested.
- **False-negative rate (FNR):** dangerous actions incorrectly allowed divided by all dangerous actions tested.
- **Simulation:** a designed test representing a possible threat rather than an observed production event.

## Conclusion

A person sitting in front of an approval button is not, by itself, effective oversight. In Anthropic’s internal evaluation, the classifier blocked most selected real overreaches while missing approximately nine of 52; it also missed 57 of 1,000 synthetic exfiltration attempts. Those are bounded results for one system, not a general safety guarantee.

Real oversight begins when an organization knows which actions the agent cannot take, which reversible actions it may perform with logs, and which consequential decisions deserve deliberate human judgment. That turns the human from a final stamp into an accountable control.

## References

1. Anthropic Engineering. *How we built Claude Code auto mode: a safer way to skip permissions*. 25 March 2026. https://www.anthropic.com/research/claude-code-auto-mode
2. Lyell D, Coiera E. *Automation bias and verification complexity: a systematic review*. Journal of the American Medical Informatics Association. 2017;24(2):423–431. https://pmc.ncbi.nlm.nih.gov/articles/PMC7651899/
3. European Parliament and Council. *Regulation (EU) 2024/1689 — Artificial Intelligence Act*, consolidated text, 27 July 2026. https://eur-lex.europa.eu/eli/reg/2024/1689/2026-07-27/eng
4. European Parliament and Council. *Regulation (EU) 2026/1744*. 24 July 2026. https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng
5. National Institute of Standards and Technology. *AI Risk Management Framework Core*. https://airc.nist.gov/airmf-resources/airmf/5-sec-core/
6. OECD.AI. *Human-centred values and fairness — Principle 1.2*. https://oecd.ai/en/dashboards/ai-principles/P6
7. OWASP Gen AI Security Project. *LLM06:2025 Excessive Agency*. https://genai.owasp.org/llmrisk/llm062025-excessive-agency/
