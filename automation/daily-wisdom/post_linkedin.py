"""Publish a daily wisdom post (Arabic card + English card) to the owner's LinkedIn profile.

Usage:
  python3 -I post_linkedin.py check
  python3 -I post_linkedin.py post --spec <spec.json> --article <file.html> [--dry-run]

Authentication: the preferred setup is a Claude "network secret" for api.linkedin.com and www.linkedin.com,
which adds the Authorization header outside the session, so the token is never visible here.
If LINKEDIN_ACCESS_TOKEN is set instead, it is used directly. The token is never printed.
API references (Marketing versioned APIs): Images API (initializeUpload), Posts API (multiImage), little text format.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONFIG = json.loads((HERE / "config.json").read_text(encoding="utf-8"))["linkedin"]
API = "https://api.linkedin.com"
SITE = "https://tamayuz10x.com"
# Characters reserved by LinkedIn's "little" text format; each must be escaped with a backslash.
RESERVED = set("\\|{}@[]()<>#*_~")


def token():
    """Token from the environment, or None when a network secret adds the header instead."""
    return os.environ.get("LINKEDIN_ACCESS_TOKEN", "").strip() or None


def call(method, url, body=None, data=None, headers=None, auth=True):
    h = {"X-Restli-Protocol-Version": "2.0.0", "LinkedIn-Version": CONFIG["api_version"]}
    if auth and token():
        h["Authorization"] = "Bearer " + token()
    if body is not None:
        data = json.dumps(body, ensure_ascii=False).encode("utf-8")
        h["Content-Type"] = "application/json"
    h.update(headers or {})
    req = urllib.request.Request(url, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read()
            return r.status, dict(r.headers), (json.loads(raw) if raw.strip().startswith(b"{") else raw)
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:500]
        hint = " (no token reached LinkedIn: check the network secret or LINKEDIN_ACCESS_TOKEN)" if e.code == 401 else ""
        sys.exit(f"LinkedIn API error {e.code} on {method} {url.split('?')[0]}: {detail}{hint}")


def person_urn():
    _, _, info = call("GET", API + "/v2/userinfo")
    return "urn:li:person:" + info["sub"], info.get("name", "")


def escape(text):
    return "".join("\\" + c if c in RESERVED else c for c in text)


def commentary(spec, article):
    ar, en = spec["ar"], spec["en"]
    if ar.get("teaser") and en.get("teaser"):
        return escape("\n".join([ar["teaser"], f"{SITE}/{article}", "", en["teaser"], f"{SITE}/en/{article}"]))
    lines = [
        ar["wisdom"], "",
        en["wisdom"], "",
        f"من مقال: {ar['title']}", f"{SITE}/{article}", "",
        f"From the article: {en['title']}", f"{SITE}/en/{article}",
    ]
    return escape("\n".join(lines))


def upload(owner, png):
    _, _, res = call("POST", API + "/rest/images?action=initializeUpload",
                     body={"initializeUploadRequest": {"owner": owner}})
    v = res["value"]
    call("PUT", v["uploadUrl"], data=Path(png).read_bytes(),
         headers={"Content-Type": "application/octet-stream"})
    return v["image"]


def main():
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check")
    p = sub.add_parser("post")
    p.add_argument("--spec", required=True)
    p.add_argument("--article", required=True, help="file name of the article, e.g. article-x.html")
    p.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()

    if a.cmd == "check":
        urn, name = person_urn()
        print(json.dumps({"ok": True, "author": urn, "name": name, "api_version": CONFIG["api_version"]}, ensure_ascii=False))
        return

    spec = json.loads(Path(a.spec).read_text(encoding="utf-8"))
    out = Path(spec["out_dir"])
    images = [(out / f"{spec['slug']}-ar.png", spec["ar"]["wisdom"]), (out / f"{spec['slug']}-en.png", spec["en"]["wisdom"])]
    for png, _ in images:
        if not png.exists():
            sys.exit(f"Missing card: {png}")
    text = commentary(spec, a.article)
    if a.dry_run:
        print(json.dumps({"dry_run": True, "commentary": text, "images": [str(p) for p, _ in images]}, ensure_ascii=False, indent=1))
        return

    owner, _ = person_urn()
    media = [{"id": upload(owner, png), "altText": alt[:120]} for png, alt in images]
    body = {
        "author": owner,
        "commentary": text,
        "visibility": CONFIG.get("visibility", "PUBLIC"),
        "distribution": {"feedDistribution": "MAIN_FEED", "targetEntities": [], "thirdPartyDistributionChannels": []},
        "content": {"multiImage": {"images": media}},
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False,
    }
    status, headers, _ = call("POST", API + "/rest/posts", body=body)
    lower = {k.lower(): v for k, v in headers.items()}
    post_id = lower.get("x-restli-id") or lower.get("x-linkedin-id")
    print(json.dumps({"ok": status == 201, "post_id": post_id,
                      "url": f"https://www.linkedin.com/feed/update/{post_id}/" if post_id else None}))


if __name__ == "__main__":
    main()
