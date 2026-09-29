# English Site-Wide Review — Terminology Map and Editorial Register

**Started:** 2026-09-29  
**Mode:** Site-Wide Expert Review (`10X_ENGLISH_EDITORIAL_TRANSLATION_AND_HUMAN_STYLE_STANDARD.md`, sections 28–31)  
**English variant:** American English

## How pages are protected from machine translation

`scripts/bilingual_sync.py` skips any target page that contains:

```html
<meta name="tamayuz:edition" content="editorial">
```

Every English page written or reviewed by an editor carries this marker. A full sync can still rebuild unmarked pages from Arabic, but it will not overwrite editorial English. Before this change, a full sync would have replaced every English page, including all hand-written cases, with machine translation.

## Terminology map

| Arabic | English (default) | Notes |
|---|---|---|
| التميّز 10X | Tamayuz 10X | Brand name. Never translate. |
| ثقافة التميّز 10X | the Tamayuz 10X culture | |
| التميّز المؤسسي | organizational excellence | Not "institutional" or "corporate" excellence. |
| الذكاء المؤسسي | organizational intelligence | |
| بناء القدرات | capability building | Matches the "Capability Building" navigation label. |
| الكفاءة / السعة / القدرة | competency / capacity / capability | Training page: capacity = resources available; capability = what the organization can reliably achieve. |
| القدرة المتجددة | renewing capability | Dynamic capability (Teece). |
| القدرة / القدرات | capability / capabilities | Not "ability" or "capacity" unless the meaning is volume. |
| هندسة التحول | transformation engineering | Concept name; keep. |
| نموذج العمل | operating model | "Business model" only for commercial models. |
| خط المقدمة / الريادة | the frontier; the leading edge | Never "front line" or "introduction line". |
| الاستشراف | foresight; anticipating the future | Do not claim formal foresight methods without evidence (manual §21.2). |
| إعادة الابتكار | reinvention | Not "re-innovation". |
| الرسالة | mission | Not "message". |
| الادعاء | claim | Not "prosecution". |
| الروايات (الملهمة) | (inspiring) stories | Not "novels". |
| نسبة (معلومة إلى جهة) | attribution | Not "percentage". |
| الجهة | organization | Or agency, authority, body, by context. |
| المستفيد | the people served; patient; customer | By context. |
| أصحاب المصلحة | stakeholders | |
| حالة 10X | 10X case | |
| عدسة 10X | the 10X lens | Heading: "The 10X Lens". |
| دليل الأثر | what the evidence shows | Heading. Not "Impact Guide". |
| قابلية النقل | where the principle transfers; transferability | Heading. Not "Portability". |
| حدود الدليل | evidence limits | |
| تنويه تحريري | editorial disclaimer | Approved English text: see any case page. |
| الدكتور علاء محمد أحمد | Dr. Alaa Mohammad Ahmed | |

## Editorial register

Status: **Done** = rewritten in this review · **Authored** = already editorial English · **Queued** = machine-translated, not yet reviewed.

| Page | Type | MT share before | Status | Main issue / change |
|---|---|---|---|---|
| en/vision-mission-values.html | identity | 98% | Done (batch 1) | Meaning errors fixed: "Message"→Mission, "front line/introduction line"→frontier, "prosecution"→claims, "novels"→stories, "foregone conclusion"→horizon |
| en/services.html | profile | 92% | Done (batch 1) | Terminology aligned (organizational excellence, capability building) |
| en/contact.html | utility | 83% | Done (batch 1) | Error message was "Could not close temporary folder: %s"; form labels |
| en/healthcare-excellence.html | section | 78% | Done (batch 1) | Leaked mask code in descriptions; wording |
| en/leadership-excellence.html | section | 78% | Done (batch 1) | "Corporate" → organizational; wording |
| en/editorial-policy-disclaimer.html | policy | 99% | Done (batch 1) — **human review** | §2 missing verb and leaked code; §11 "percentage"→attribution; §13 "disclaimer or disclaimer". Meaning restored to match the Arabic; no policy change intended |
| en/training.html | section | 94% | Done (batch 2) | Competency/capacity/capability distinction restored ("capacity and capacity"); "Son."→Build, "Note and hope"→Reflective observation; standard Kolb, Kirkpatrick and Bloom terms |
| en/research.html | section | 83% | Done (batch 2) | Title fixed; 11 paper summaries rebuilt in full (MT had dropped sentences and inverted meaning, e.g. "mental health along with tertiary education"); "Search Published"→Published research; co-author names restored |
| en/case-ega-dx-ultra-innovation.html | case | 92% | Queued (batch 3) | Needs evidence check |
| en/case-dewa-hydro-insight-smart-water.html | case | 91% | Queued (batch 3) | "early flaw detection" wording |
| en/case-aravind-eye-care-high-volume-value.html | case | 89% | Queued (batch 3) | "Whitewater Surgery" (cataract surgery) |
| en/case-tawam-erabs-bariatric-recovery.html | case | 88% | Queued (batch 3) | |
| en/case-dubai-paperless-10x.html | case | 87% | Queued (batch 3) | |
| en/idea-*.html (3 pages) | idea | 80–87% | Queued (batch 4) | |
| en/article-ahsanu-amala.html | article | 91% | Queued (batch 4) | |
| en/personality.html, books, news, videos, life-society | noindex | 60–97% | Queued (batch 5) | Life & Society: leaked code fixed only |
| en/case-govuk-one-login-shared-government-capability.html | redirect stub | 71% | Queued (batch 5) | "State transferred", "Moving to the new state" |
| All other English pages (34) | various | 0–25% | Authored | Protected by the editorial marker |
