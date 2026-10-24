# Quality review — agent-built customer-service agents

## Review type

Independent-reader simulation by the publishing agent. This is an editorial simulation, not a test with human participants.

## First critique of Arabic draft

### Title-only test

Initial title: “هل يستطيع الذكاء الاصطناعي بناء وكيل خدمة عملاء موثوق؟ اختبار 53 مشروعًا”

Issue: “53 مشروعًا” could imply 53 real deployments. The source describes 53 simulated construction tasks.

Revision: “هل يستطيع الذكاء الاصطناعي بناء وكيل خدمة عملاء موثوق؟ دليل من 53 مهمة بناء”

Result after revision: PASS. The actor, deliverable, reliability question, and sample are visible without specialist knowledge.

### Introduction with title hidden

Answers extracted from the first 135 Arabic words:

- Problem: a coding agent can deliver a system that runs and passes its own tests while missing business rules, stakeholder-only requirements, and API failure behavior.
- Who faces it: an institutional technology team receiving the customer-service system.
- What changes: the study gives an AI coding agent the full construction job and then evaluates the delivered agent on hidden cases.

Result: PASS.

### 20–35 word story sentence

“اختبر الباحثون وكلاء برمجيين في بناء أنظمة خدمة عملاء من أدلة مؤسسية، فبلغ أفضل متوسط 23.9 من 100 وكشف فجوة بين تشغيل النظام وجاهزيته للنشر.”

Arabic word count: 26.

Result: PASS.

## Seven mandatory Arabic gates — draft stage

1. Title: PASS after replacing “53 projects” with “53 construction tasks.”
2. Introduction: PASS; problem, institution, and change are recoverable without the title.
3. Story summary: PASS; 26-word sentence above.
4. Terminology: PASS in the draft. Coding agent, customer-service agent, API, held-out case, ground truth, reference ceiling, and mean score are defined at first use or in the nearby glossary. English expressions in Arabic prose are parenthesized.
5. Numbers and evidence: PASS. Every table attaches the construction-task denominator to mean scores; the draft explicitly refuses to convert 23.9/100 into 13/53. The only raw correct/incorrect pair is labelled as a single banking example: 1/93 and 92/93.
6. Mobile presentation: NOT VERIFIED at draft stage. A real narrow-viewport browser check is mandatory after the HTML pages exist and blocks publication until then.
7. Language editing: PASS at draft stage. The opening is concrete, the prose is native Arabic, and no meta-writing instruction addresses the reader.

## Beginner objections checked

- “Did 13 of 53 systems succeed?” Answered explicitly: no; 23.9 is a mean score across 53 task-level scores.
- “Were these real companies and real customers?” Answered explicitly: no; business records and users are simulated.
- “Does the expert row prove ordinary humans are 3.4 times better?” Answered explicitly: no; the expert had ground-truth access.
- “Was asking four questions proved causal?” Answered explicitly: no; subgroup sizes are not published beside the association.
- “Does one 1/93 banking result describe the whole benchmark?” Answered explicitly: no.
- “Does published API cost equal total implementation cost?” Answered explicitly: no.

## Publication decision at this stage

HOLD. Editorial gates pass except the required real mobile/browser gate, which remains NOT VERIFIED until both HTML editions are implemented and tested at narrow widths. English native-authoring and bilingual parity reviews also remain pending.
