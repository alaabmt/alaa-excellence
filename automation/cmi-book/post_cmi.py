"""Publish one post of the open-ended "Mastering Case Mix Index" LinkedIn series.

Usage:
  python3 -I post_cmi.py next                 # print the next unposted day number (or 0 when finished)
  python3 -I post_cmi.py show  --day N        # print the exact post text and the two card paths
  python3 -I post_cmi.py post  --day N [--dry-run]

Reuses the authentication and upload helpers of automation/daily-wisdom/post_linkedin.py
(token from the environment's network secret; never printed). Post = English card first,
Arabic card second, then English text, Arabic text, Amazon link and hashtags.
Every successful post is appended to log.jsonl next to this file.
"""
import argparse, json, sys, datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent / "daily-wisdom"))
import post_linkedin as pl  # noqa: E402

DATA = json.loads((HERE / "posts.json").read_text(encoding="utf-8"))
LOG = HERE / "log.jsonl"


def posted_days():
    if not LOG.exists():
        return set()
    return {json.loads(l)["day"] for l in LOG.read_text(encoding="utf-8").splitlines() if l.strip()}


def plain(n):
    p = DATA["posts"][n - 1]
    tags = " ".join("#" + t for t in DATA["hashtags"])
    return f"{p['en']}\n\n— — —\n\n{p['ar']}\n\n📘 Get the book | للحصول على الكتاب:\n{DATA['amazon']}\n\n{tags}"


def little(n):
    """LinkedIn 'little' format: escape reserved characters, keep hashtags clickable."""
    p = DATA["posts"][n - 1]
    body = pl.escape(f"{p['en']}\n\n— — —\n\n{p['ar']}\n\n📘 Get the book | للحصول على الكتاب:\n{DATA['amazon']}")
    tags = " ".join("{hashtag|\\#|" + t + "}" for t in DATA["hashtags"])
    return body + "\n\n" + tags


def cards(n):
    return [HERE / "cards" / f"Day{n:02d}_EN.png", HERE / "cards" / f"Day{n:02d}_AR.png"]


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("next")
    for c in ("show", "post"):
        s = sub.add_parser(c); s.add_argument("--day", type=int, required=True)
        if c == "post":
            s.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if a.cmd == "next":
        done = posted_days()
        print(next((d for d in range(1, len(DATA["posts"]) + 1) if d not in done), 0))
        return
    n = a.day
    if not 1 <= n <= len(DATA["posts"]):
        sys.exit(f"post number must be 1-{len(DATA['posts'])}")
    imgs = cards(n)
    for p in imgs:
        if not p.exists():
            sys.exit(f"Missing card: {p}")
    if a.cmd == "show":
        print(json.dumps({"day": n, "cards": [str(p) for p in imgs], "chars": len(plain(n)), "text": plain(n)}, ensure_ascii=False, indent=1))
        return
    if n in posted_days():
        sys.exit(f"Day {n} is already in log.jsonl; refusing to post it twice.")
    text = little(n)
    if len(text) > 3000:
        sys.exit(f"Post is {len(text)} characters; LinkedIn allows 3000.")
    if a.dry_run:
        print(json.dumps({"dry_run": True, "day": n, "chars": len(text), "commentary": text}, ensure_ascii=False, indent=1))
        return
    owner, _ = pl.person_urn()
    alts = [f"Mastering Case Mix Index, insight {n} (English card)", f"Mastering Case Mix Index, insight {n} (Arabic card)"]
    media = [{"id": pl.upload(owner, p), "altText": alt} for p, alt in zip(imgs, alts)]
    body = {"author": owner, "commentary": text, "visibility": pl.CONFIG.get("visibility", "PUBLIC"),
            "distribution": {"feedDistribution": "MAIN_FEED", "targetEntities": [], "thirdPartyDistributionChannels": []},
            "content": {"multiImage": {"images": media}}, "lifecycleState": "PUBLISHED", "isReshareDisabledByAuthor": False}
    status, headers, _ = pl.call("POST", pl.API + "/rest/posts", body=body)
    lower = {k.lower(): v for k, v in headers.items()}
    pid = lower.get("x-restli-id") or lower.get("x-linkedin-id")
    if status != 201:
        sys.exit(f"Unexpected status {status}")
    url = f"https://www.linkedin.com/feed/update/{pid}/" if pid else None
    with LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps({"day": n, "post_id": pid, "url": url,
                            "posted_at": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="seconds")}) + "\n")
    print(json.dumps({"ok": True, "day": n, "post_id": pid, "url": url}))


if __name__ == "__main__":
    main()
