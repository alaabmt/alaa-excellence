"""Publish the Arabic daily wisdom card to the owner's Facebook Page.

Usage:
  python3 -I post_facebook.py check
  python3 -I post_facebook.py post --spec <spec.json> --article <file.html> [--dry-run]

Authentication: a Page access token stored as a Claude "network secret" for graph.facebook.com
(header Authorization: Bearer <token>), so the token is never visible here. If FACEBOOK_PAGE_TOKEN
is set instead, it is used directly. The token is never printed.
Facebook apps cannot post to personal profiles; this posts to the Page that owns the token.
"""
import argparse
import json
import os
import sys
import urllib.error
import urllib.request
import uuid
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONFIG = json.loads((HERE / "config.json").read_text(encoding="utf-8"))["facebook"]
API = "https://graph.facebook.com/" + CONFIG["api_version"]
SITE = "https://tamayuz10x.com"


def call(method, path, data=None, headers=None):
    h = dict(headers or {})
    t = os.environ.get("FACEBOOK_PAGE_TOKEN", "").strip()
    if t:
        h["Authorization"] = "Bearer " + t
    req = urllib.request.Request(API + path, data=data, method=method, headers=h)
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:500]
        sys.exit(f"Facebook API error {e.code} on {method} {path.split('?')[0]}: {detail}")


def page():
    info = call("GET", "/me?fields=id,name")
    return info["id"], info.get("name", "")


def caption(spec, article):
    ar = spec["ar"]
    return f"{ar['wisdom']}\n\nمن مقال: {ar['title']}\n{SITE}/{article}"


def multipart(fields, file_field, file_path):
    boundary = uuid.uuid4().hex
    out = bytearray()
    for k, v in fields.items():
        out += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n".encode()
        out += str(v).encode("utf-8") + b"\r\n"
    out += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"{file_field}\"; "
            f"filename=\"{Path(file_path).name}\"\r\nContent-Type: image/png\r\n\r\n").encode()
    out += Path(file_path).read_bytes() + b"\r\n"
    out += f"--{boundary}--\r\n".encode()
    return bytes(out), f"multipart/form-data; boundary={boundary}"


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
        pid, name = page()
        print(json.dumps({"ok": True, "page_id": pid, "page_name": name, "api_version": CONFIG["api_version"]}, ensure_ascii=False))
        return

    spec = json.loads(Path(a.spec).read_text(encoding="utf-8"))
    png = Path(spec["out_dir"]) / f"{spec['slug']}-ar.png"
    if not png.exists():
        sys.exit(f"Missing card: {png}")
    text = caption(spec, a.article)
    if a.dry_run:
        print(json.dumps({"dry_run": True, "message": text, "image": str(png)}, ensure_ascii=False, indent=1))
        return
    pid, _ = page()
    body, ctype = multipart({"message": text, "published": "true"}, "source", png)
    res = call("POST", f"/{pid}/photos", data=body, headers={"Content-Type": ctype})
    post_id = res.get("post_id") or res.get("id")
    print(json.dumps({"ok": bool(post_id), "post_id": post_id,
                      "url": f"https://www.facebook.com/{post_id}" if post_id else None}))


if __name__ == "__main__":
    main()
