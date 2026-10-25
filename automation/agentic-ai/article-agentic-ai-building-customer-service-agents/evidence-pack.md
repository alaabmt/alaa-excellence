# Evidence Pack — agent-built customer-service agents

## Source hierarchy

1. Primary paper (direct, v1, 4 Sep 2026): https://arxiv.org/html/2609.04611v1
2. Official released code/tasks: https://github.com/sierra-research/hyper-tau-bench
3. Secondary benchmark paper (side box only): https://arxiv.org/html/2505.18878v1
4. Secondary benchmark official repository: https://github.com/SalesforceAIResearch/CRMArena
5. NIST AI RMF Core: https://airc.nist.gov/airmf-resources/airmf/5-sec-core/

## Claim ledger

| Claim | Direct evidence | Type | Confidence | Limits |
|---|---|---|---|---|
| The benchmark makes construction of a complete customer-service agent the task. | Primary paper, lines 69–71 and 80–84 | Primary preprint | High for study design | Simulated environment, not a production deployment |
| A developer receives business records, an optional simulated client, a client REST API, code/stubs, model choices, and a cost budget. | Primary paper, lines 80–83, 130–168 | Primary preprint | High | Artifacts are generated from benchmark policies and validated; not records from a named real company |
| The release contains 53 construction tasks: airline 6, retail 6, telecom 6, banking 35. | Primary paper Table 2, lines 185–196; official repo lines 320–323 | Primary paper + official code | High | Banking contributes 35/53 tasks, so the overall mean is banking-heavy |
| Six automated developer configurations were evaluated, one construction trial per configuration per task. | Primary paper lines 173–186 | Primary preprint | High | No repeated construction trials; build variance is unknown |
| Best automated mean was 23.9/100 across 53 task-level scores; expert-authored reference ceiling was 82.2/100. | Primary paper Table 2, lines 187–201 | Primary preprint | High for reported result | These are mean scores, not 13/53 versus 44/53 successful projects; expert has ground-truth access |
| Best automated domain means were 55.9/100 airline (6), 72.8/100 retail (6), 48.2/100 telecom (6), and 5.9/100 banking (35). | Primary paper Table 2, lines 187–196 | Primary preprint | High | Domain averages are not raw counts of passed cases |
| Banking contains 2,969 atomic facts; a task can use up to 580, versus 85/119/155 facts in the other domains. | Primary paper lines 200–202 | Primary preprint | High | Complexity explanation is the authors’ analysis, not a randomized manipulation |
| The full evidence set has 2,868 artifacts and more than 5.5 million text tokens. | Primary paper lines 130–157 | Primary preprint | High | Generated benchmark corpus |
| Average build time/cost: GPT-5.6-sol Codex 47.9 min/$18.2; Claude Opus 5 Claude Code 216.3 min/$42.0; Kimi K3 Kimi Code 205.7 min/$13.5. | Primary paper Table 2, lines 187–196 | Primary preprint | High | API list prices and benchmark hardware; not full organizational cost |
| Only 0.3% of recorded tool calls were client conversations. | Primary paper lines 203–207 | Primary preprint | Medium-high | Share of calls, not share of time; exact numerator/denominator not printed |
| Client-enabled builds asking no questions averaged 0.16 reward; four or more questions averaged 0.50. | Primary paper lines 205–207 | Primary preprint | Medium | Subgroup sizes are not printed in the main text; association, not causal proof |
| 92% of completed builds used a single LLM tool loop. | Primary paper lines 211–214 | Primary preprint | Medium-high | Exact completed-build count is not printed beside the percentage |
| A one-line architecture hint raised a telecom probe from 31/100 to 67/100. | Primary paper lines 212–214 | Primary preprint | Medium | Controlled probe, but the evaluation-case denominator is not stated beside the result |
| In a whole-domain banking example, 1/93 cases succeeded and 92/93 did not; score 1.1%. | Primary paper lines 223–225 | Primary preprint | High | One task family/example, not the overall benchmark |
| CRMArena-Pro includes 19 expert-validated CRM task types; leading agents scored about 58% in single-turn and 35% in multi-turn settings. | Secondary paper lines 103–110, 122–128 | Independent secondary study | Medium-high | Different benchmark; percentages aggregate model/task runs and are not directly comparable to τ^τ-Bench |
| CRMArena-Pro uses 25 connected Salesforce objects, 29,101 B2B records and 54,569 B2C records. | Secondary paper lines 125–127 | Independent secondary study | High | Synthetic records in a sandbox |
| NIST calls for defined roles, documented oversight, evaluation, monitoring, incident response, and risk management across the lifecycle. | NIST AI RMF Core | Official framework | High for guidance | Voluntary framework; not evidence that a particular control works |

## Metric boundary

The primary paper defines each task score as the mean held-out evaluation reward minus any serving-budget overage penalty. The overall score is the unweighted mean of 53 task scores. Consequently:

- `23.9/100 across 53 tasks` is the correct expression.
- `about 13 of 53 projects succeeded` is unsupported and must not appear.
- The complement `76.1/100` is a score gap, not necessarily a count of failed simulations.
- Absolute correct/incorrect totals are available only where the paper publishes them, such as 1/93 and 92/93 in the whole-domain banking example.
- For percentages without published counts (0.3%, 92%, 31%, 67%), the article must explicitly say that the adjacent source text does not print the exact numerator/denominator.

## Fact versus inference

- **Source establishes:** performance in a simulated, sealed benchmark; configuration means; domain differences; recorded development behavior.
- **Source authors infer:** weak requirement gathering, shallow evidence reading, limited design exploration, and budget habits contribute to the gap.
- **10X editorial inference:** institutions should treat an agent-built agent as an untrusted supplier deliverable until it passes hidden acceptance cases, policy coverage, stakeholder review, API fault tests, and cost-quality gates.
- **Not established:** production failure rates; return on investment; superiority of a specific vendor; average human developer performance; legal compliance; safety in a named institution.
