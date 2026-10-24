#!/usr/bin/env python3
"""Conservative, read-only Tamayuz 10X security hygiene checks (stdlib only)."""
import argparse
import json
import pathlib
import re
import subprocess
from datetime import datetime, timezone

SKIP_DIRS = {".git", "node_modules", ".venv", "venv", "dist", "build", ".upload-hq"}
TEXT_EXT = {".yml", ".yaml", ".json", ".js", ".mjs", ".ts", ".html", ".py", ".toml", ".env", ".sh"}
MAX_SIZE = 1_000_000
PATTERNS = [
    ("private-key-marker", "high", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----")),
    ("github-token-shape", "high", re.compile(r"gh[pousr]_[A-Za-z0-9_]{30,}")),
    ("aws-access-key-shape", "high", re.compile(r"\b(?:AKIA|ASIA)[A-Z0-9]{16}\b")),
    ("supabase-service-role-assignment", "high", re.compile(r"(?i)(?:SUPABASE_SERVICE_ROLE_KEY|service_role_key)\s*[:=]\s*['\"][^'\"\s$][^'\"]{15,}")),
]
WORKFLOW_PERMISSIONS = re.compile(r"(?m)^\s*permissions\s*:\s*write-all\s*$")
ACTION_REF = re.compile(r"(?m)^\s*-?\s*uses:\s*([^\s#]+)")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    parser.add_argument("--output", default="security-report.json")
    args = parser.parse_args()
    root = pathlib.Path(args.root).resolve()
    findings = []
    scanned = 0
    for path in root.rglob("*"):
        if not path.is_file() or any(part in SKIP_DIRS for part in path.relative_to(root).parts):
            continue
        if path.suffix.lower() not in TEXT_EXT or path.stat().st_size > MAX_SIZE:
            continue
        rel = path.relative_to(root).as_posix()
        # Never read or print actual .env contents; just flag accidental tracking.
        if path.name == ".env" or path.name.startswith(".env."):
            findings.append(dict(rule="tracked-env-file", severity="medium", file=rel, line=0, note="Review tracked environment file; no content inspected"))
            continue
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except (UnicodeError, OSError):
            continue
        scanned += 1
        for number, line in enumerate(lines, 1):
            for rule, severity, regex in PATTERNS:
                if regex.search(line):
                    findings.append(dict(rule=rule, severity=severity, file=rel, line=number, note="Potential secret pattern; verify privately (no value retained)"))
            if rel.startswith(".github/workflows/"):
                if WORKFLOW_PERMISSIONS.search(line):
                    findings.append(dict(rule="workflow-write-all", severity="high", file=rel, line=number, note="Overly broad workflow token permission"))
                match = ACTION_REF.search(line)
                if match:
                    ref = match.group(1)
                    if ref.startswith("./") or ref.startswith("docker://"):
                        continue
                    if "@" in ref and not re.fullmatch(r"[0-9a-fA-F]{40}", ref.rsplit("@", 1)[1]):
                        findings.append(dict(rule="action-unpinned", severity="medium", file=rel, line=number, note="Third-party action is not pinned to full commit SHA"))
    try:
        commit = subprocess.check_output(["git", "-C", str(root), "rev-parse", "HEAD"], text=True, stderr=subprocess.DEVNULL).strip()
    except (OSError, subprocess.CalledProcessError):
        commit = None
    report = {
        "agent": "Tamayuz 10X Cybersecurity Guardian",
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "commit": commit,
        "files_scanned": scanned,
        "scope": "Conservative static repository checks only; no live penetration testing",
        "status": "REVIEW" if findings else "PASS",
        "limitations": ["Heuristic matches require manual validation", "No live Cloudflare, Supabase, authentication, dependency CVE, or deployed header verification"],
        "findings": findings,
    }
    output = pathlib.Path(args.output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Cybersecurity Guardian: {report['status']}; scanned {scanned} files; {len(findings)} potential findings. See {output}")
    # Findings need human review; do not fail existing publishing workflows on heuristic hits.
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
