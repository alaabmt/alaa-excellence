#!/usr/bin/env python3
"""Audit shared navigation coverage for all public HTML pages."""
from pathlib import Path
import json
ROOT = Path(__file__).resolve().parents[1]
excluded = ("account/", "admin/", "tools/", ".github/")
rows = []
for p in sorted(ROOT.rglob("*.html")):
    rel = p.relative_to(ROOT).as_posix()
    if rel.startswith(excluded) or "/node_modules/" in rel:
        continue
    content = p.read_text(encoding="utf-8", errors="replace")
    if "<body" not in content.lower():
        continue
    direct = "unified-navigation.js" in content
    main = "assets/js/main.js" in content
    engagement = "site-engagement.js" in content
    coverage = direct or main or engagement
    rows.append({"page":rel,"direct":direct,"main":main,"engagement":engagement,"covered":coverage})
missing = [r["page"] for r in rows if not r["covered"]]
print(json.dumps({"pages_checked":len(rows),"covered":len(rows)-len(missing),"missing_count":len(missing),"missing":missing},ensure_ascii=False,indent=2))
raise SystemExit(1 if missing else 0)
