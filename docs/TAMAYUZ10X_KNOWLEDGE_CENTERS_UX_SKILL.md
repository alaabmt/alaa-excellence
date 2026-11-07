# Tamayuz 10X — Knowledge Centers UX & Editorial Skill
Version: 1.0 | 2026-11-01
## Scope
Design and maintain the bilingual Arabic/English knowledge-centers landing page and its connections to existing article collections. This is a repository-specific operating guide, not an automatically installed ChatGPT skill.
## Approved five centers
1. Artificial Intelligence (AI) — independent.
2. Preventive Engineering (FMEA) — independent; reuse fmea.html / en/fmea.html.
3. Excellence & Leadership — management, business, innovation, ideas, building and society.
4. Healthcare Excellence — healthcare quality, safety, improvement.
5. Quranic Reflections — reuse quranic-reflections.html and its English counterpart where present.
Cases/experiences are a content TYPE within relevant centers, not a sixth center. Articles can be discoverable in multiple centers without duplicate article URLs.
## UX design requirements
- Editorial portal, not a dashboard or advertisement. Five equal-status destinations; avoid promoting FMEA alone.
- Arabic RTL-first, English LTR parity. One-column center navigation on narrow phones; generous touch targets >=44x44px.
- Each center: exact title, meaningful one-sentence scope, visible destination, actual article count only if computed from source, featured/recent material only if verified.
- Provide a global search and preserve existing article search, filters, sorting and deep links.
- Accessible heading hierarchy, landmarks, keyboard focus, contrast >=4.5:1 for body text, descriptive link labels, reduced-motion support.
- Mobile 320/375/390/768px; desktop 1280px; avoid horizontal scrolling.
## Editorial taxonomy
- Preserve source metadata and canonical article URLs.
- Map current 'case' content by substantive subject; never assign all cases to Leadership by default.
- Map 'idea', 'management', 'leadership', 'cities/society' to Excellence & Leadership unless topic merits another center.
- Map 'healthcare' to Healthcare Excellence, 'prevention' to FMEA, Quranic content to Quranic Reflections, and substantive AI content to AI.
- Multi-center discoverability is acceptable; a single article remains a single canonical URL.
- Do not invent counts, publication dates, or article summaries.
## Technical implementation
- Audit current articles.html, en/articles.html, main.js, CSS and available category metadata before edits.
- Reuse existing center URLs and avoid breaking existing filters.
- Keep canonical/hreflang and structured data valid; do not duplicate CollectionPage URLs.
- Maintain a single mapping/configuration for center names and routes where practical.
- Avoid unsafe mass replacements; use small, verifiable commits and verify both languages.
- QA: center destinations, search, mobile layout, Arabic typography, keyboard accessibility, and deployment status.
## Acceptance criteria
All five centers visible in both languages; AI and FMEA independent; cases and innovation integrated into relevant centers; existing articles and search still function; no broken links or duplicate canonical pages; responsive accessible UI.
