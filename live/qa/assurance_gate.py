#!/usr/bin/env python3
"""Tamayuz Live-only readiness decision. Offline, non-mutating, fail-closed.

No network/API/database calls are made. This validates evidence metadata, NOT the
truth of source artifacts. The Guardian must separately retrieve and review cited
artifacts before presenting any externally trusted GO decision.
"""
from __future__ import annotations

import argparse
import datetime as dt
import json
import re
import sys
from pathlib import Path

SITE = "https://tamayuz10x.com/live/"
SHA = re.compile(r"^[0-9a-f]{40}$")
HEX256 = re.compile(r"^[0-9a-f]{64}$")
MODES = {"engineering", "conference"}
# Evidence maximum age (hours). These are initial operating policy values, not SLAs.
GATES = {
    "deployment_provenance": ("P0", "production_deployment", 24),
    "authorization_security": ("P0", "real_api_security", 168),
    "critical_user_journeys": ("P0", "real_backend_e2e", 48),
    "conference_capacity": ("P0", "controlled_concurrency", 720),
    "active_monitoring": ("P0", "verified_alert_delivery", 24),
    "recovery_drill": ("P0", "isolated_restore", 2160),
    "vote_data_integrity": ("P0", "real_database_integrity", 24),
    "abuse_resistance": ("P0", "rate_limit_and_abuse", 168),
    "physical_devices": ("P1", "real_device", 168),
    "accessibility": ("P1", "accessibility_review", 720),
    "privacy_retention": ("P1", "privacy_review", 2160),
    "independent_security": ("P1", "independent_security_review", 2160),
}


def utc(value):
    if not isinstance(value, str):
        raise ValueError("Missing UTC timestamp")
    parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    if parsed.tzinfo is None:
        raise ValueError("Timestamp must have timezone")
    return parsed.astimezone(dt.timezone.utc)


def trusted_reference(value):
    # Production evidence URLs must be HTTPS; local file names are NOT proof.
    return isinstance(value, str) and value.startswith("https://") and len(value) < 2048 and not any(
        c in value for c in "\n\r\t< >"
    )


def changed_path_allowed(path):
    """Reject absolute/traversal/non-Live paths, case-sensitive repository paths."""
    if not isinstance(path, str) or not path or path.startswith(("/", "\\")):
        return False
    if "\\" in path or "\x00" in path or any(x in ("", ".", "..") for x in path.split("/")):
        return False
    return (path.startswith("live/") or
            (path.startswith("tests/tamayuz-live-") and path.count("/") == 1) or
            (path.startswith(".github/workflows/tamayuz-live-") and path.count("/") == 2))


def check_scope(paths):
    paths = list(paths)
    rejected = sorted({p for p in paths if not changed_path_allowed(p)})
    return {"result": "FAIL" if rejected else "PASS", "checked": len(paths), "rejected": rejected}


def check_evidence(item, gate, now, expected_sha, expected_edge):
    tier, kind, max_age_hours = GATES[gate]
    if not isinstance(item, dict):
        return {"gate": gate, "tier": tier, "status": "NOT_VERIFIED", "reason": "Missing evidence"}
    status = item.get("status", "NOT_VERIFIED")
    if status not in ("PASS", "FAIL", "NOT_VERIFIED"):
        return {"gate": gate, "tier": tier, "status": "NOT_VERIFIED", "reason": "Invalid evidence status"}
    if status != "PASS":
        return {"gate": gate, "tier": tier, "status": status, "reason": item.get("reason", "No passing evidence")}
    requirements = [
        (item.get("kind") == kind, "Wrong evidence kind (a mock cannot certify production)"),
        (item.get("environment") == "production-like", "Evidence must describe production-like environment"),
        (item.get("frontend_sha") == expected_sha, "Evidence is from another frontend revision"),
        (item.get("edge_version") == expected_edge, "Evidence is from another Edge Function version"),
        (trusted_reference(item.get("artifact_url")), "Missing trusted HTTPS artifact URL"),
        (HEX256.fullmatch(str(item.get("artifact_sha256", ""))) is not None, "Missing artifact digest"),
        (bool(str(item.get("verifier", "")).strip()), "Missing verifier identity"),
    ]
    for ok, why in requirements:
        if not ok:
            return {"gate": gate, "tier": tier, "status": "NOT_VERIFIED", "reason": why}
    try:
        when = utc(item.get("observed_at"))
    except (ValueError, TypeError):
        return {"gate": gate, "tier": tier, "status": "NOT_VERIFIED", "reason": "Invalid UTC timestamp"}
    age = (now - when).total_seconds() / 3600
    if age < -0.25:
        return {"gate": gate, "tier": tier, "status": "NOT_VERIFIED", "reason": "Evidence timestamp is in future"}
    if age > max_age_hours:
        return {"gate": gate, "tier": tier, "status": "NOT_VERIFIED", "reason": "Evidence is stale"}
    return {"gate": gate, "tier": tier, "status": "PASS", "reason": "Metadata valid; underlying artifact must still be independently reviewed"}


def signoff_valid(signoff, now, expected_sha, expected_edge):
    if not isinstance(signoff, dict):
        return False
    if signoff.get("frontend_sha") != expected_sha or signoff.get("edge_version") != expected_edge:
        return False
    if signoff.get("role") not in ("CIO", "EVENT_OWNER", "RELEASE_OWNER"):
        return False
    if not isinstance(signoff.get("approver"), str) or len(signoff["approver"].strip()) < 3:
        return False
    if not trusted_reference(signoff.get("approval_url")):
        return False
    try:
        age = (now - utc(signoff.get("approved_at"))).total_seconds() / 3600
        return 0 <= age <= 24
    except (ValueError, TypeError):
        return False


def assess(manifest, now=None):
    now = now or dt.datetime.now(dt.timezone.utc)
    if not isinstance(manifest, dict) or manifest.get("schema_version") != 1 or manifest.get("site") != SITE:
        raise ValueError("Invalid Tamayuz Live evidence manifest")
    sha = manifest.get("frontend_sha", "")
    edge = manifest.get("edge_version")
    if not isinstance(sha, str) or not SHA.fullmatch(sha):
        raise ValueError("frontend_sha must be a 40-character Git SHA")
    if type(edge) is not int or edge <= 0:
        raise ValueError("edge_version must be a positive integer")
    evidence = manifest.get("evidence", {})
    if not isinstance(evidence, dict):
        raise ValueError("evidence must be an object")
    outcomes = [check_evidence(evidence.get(gate), gate, now, sha, edge) for gate in GATES]
    p0_blockers = [x["gate"] for x in outcomes if x["tier"] == "P0" and x["status"] != "PASS"]
    p1_blockers = [x["gate"] for x in outcomes if x["tier"] == "P1" and x["status"] != "PASS"]
    signed = signoff_valid(manifest.get("release_approval"), now, sha, edge)
    accepted = set(manifest.get("accepted_p1_risks", [])) if isinstance(manifest.get("accepted_p1_risks"), list) else set()
    if p0_blockers or not signed:
        decision = "NO-GO"
    elif p1_blockers:
        decision = "CONDITIONAL GO" if set(p1_blockers) <= accepted else "NO-GO"
    else:
        decision = "GO"
    return {
        "site": SITE,
        "frontend_sha": sha,
        "edge_version": edge,
        "evaluated_at": now.isoformat(),
        "decision": decision,
        "p0_blockers": p0_blockers,
        "p1_blockers": p1_blockers,
        "release_approval_valid": signed,
        "evidence_verification": "Metadata only; manual/independent retrieval and digest verification are still required",
        "results": outcomes,
    }


def markdown(report):
    lines = [
        "# Tamayuz Live — Conference Readiness Evidence",
        "",
        f"**Decision: {report['decision']}**",
        "",
        f"- Frontend commit: `{report['frontend_sha']}`",
        f"- Edge Function version: `{report['edge_version']}`",
        f"- Evaluated UTC: {report['evaluated_at']}",
        f"- Release sign-off metadata valid: {'yes' if report['release_approval_valid'] else 'NO'}",
        "",
        "| Tier | Gate | Status | Reason |",
        "|---|---|---|---|",
    ]
    for row in report["results"]:
        reason = str(row["reason"]).replace("|", "/").replace("\n", " ")
        lines.append(f"| {row['tier']} | {row['gate']} | {row['status']} | {reason} |")
    lines.extend([
        "",
        "**Important:** This offline script validates evidence *metadata*, not artifact authenticity,",
        "operational performance or independent security review. The Guardian must fetch evidence,",
        "compare SHA-256 digests and verify actual measurements before issuing an external GO.",
        "Missing or stale P0 evidence fails closed. No automatic deployment is performed.",
        "",
    ])
    return "\n".join(lines)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--scope-paths", help="Newline-separated changed repository file list to scope-check")
    parser.add_argument("--evidence", help="Conference evidence JSON; omitted in scope-check mode")
    parser.add_argument("--report-json", help="JSON report output path")
    parser.add_argument("--report-md", help="Markdown report output path")
    parser.add_argument("--now", help="Fixed UTC time for reproducible testing")
    args = parser.parse_args(argv)
    output = {}
    if args.scope_paths:
        output["scope"] = check_scope(Path(args.scope_paths).read_text(encoding="utf-8").splitlines())
    if args.evidence:
        try:
            output["readiness"] = assess(json.loads(Path(args.evidence).read_text(encoding="utf-8")),
                                           utc(args.now) if args.now else None)
        except (ValueError, json.JSONDecodeError) as exc:
            print(f"Invalid evidence: {exc}", file=sys.stderr)
            return 3
    if not output:
        parser.error("Specify --scope-paths and/or --evidence")
    if args.report_json:
        Path(args.report_json).write_text(json.dumps(output, indent=2) + "\n", encoding="utf-8")
    if args.report_md and "readiness" in output:
        Path(args.report_md).write_text(markdown(output["readiness"]), encoding="utf-8")
    print(json.dumps(output, indent=2))
    if output.get("scope", {}).get("result") == "FAIL":
        return 3
    if "readiness" in output:
        return {"GO": 0, "CONDITIONAL GO": 2, "NO-GO": 3}[output["readiness"]["decision"]]
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
