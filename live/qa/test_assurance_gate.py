"""No-network, non-mutating unit tests for Tamayuz Live scope and readiness policy."""
import datetime as dt
import unittest

from assurance_gate import GATES, SITE, assess, check_scope, changed_path_allowed, signoff_valid

NOW = dt.datetime(2026, 11, 12, 12, 0, tzinfo=dt.timezone.utc)
SHA = "a" * 40
EDGE = 22


def passing_evidence(kind, observed="2026-11-12T11:30:00Z"):
    return {
        "status": "PASS", "kind": kind, "environment": "production-like",
        "frontend_sha": SHA, "edge_version": EDGE,
        "observed_at": observed,
        "artifact_url": "https://github.com/alaabmt/alaa-excellence/actions/runs/100",
        "artifact_sha256": "b" * 64,
        "verifier": "QA reviewer",
    }


def manifest(all_pass=False, signed=False):
    m = {"schema_version": 1, "site": SITE, "frontend_sha": SHA, "edge_version": EDGE, "evidence": {}}
    if all_pass:
        m["evidence"] = {name: passing_evidence(kind) for name, (_, kind, _) in GATES.items()}
    if signed:
        m["release_approval"] = {
            "role": "CIO", "approver": "release approver", "frontend_sha": SHA,
            "edge_version": EDGE, "approved_at": "2026-11-12T11:45:00Z",
            "approval_url": "https://github.com/alaabmt/alaa-excellence/issues/100",
        }
    return m


class ScopeGate(unittest.TestCase):
    def test_allowlist(self):
        for path in ["live/index.html", "live/backend/index.ts", "live/qa/assurance_gate.py",
                     "tests/tamayuz-live-assurance.test.mjs", ".github/workflows/tamayuz-live-assurance.yml"]:
            self.assertTrue(changed_path_allowed(path), path)

    def test_out_of_scope(self):
        for path in ["cphq.html", "cphq-free.html", "assets/js/cphq.js", "index.html",
                     "scripts/audit_unified_navigation.py", ".github/workflows/site-health.yml",
                     "tests/cphq-test.mjs", "live/../cphq.html", "/live/index.html",
                     "live\\index.html", "LIVE/index.html", "live//index.html"]:
            self.assertFalse(changed_path_allowed(path), path)
        self.assertEqual(check_scope(["live/index.html", "cphq.html"])["result"], "FAIL")


class ReadinessGate(unittest.TestCase):
    def test_default_missing_is_no_go(self):
        result = assess(manifest(), NOW)
        self.assertEqual(result["decision"], "NO-GO")
        self.assertEqual(len(result["p0_blockers"]), 8)

    def test_fake_green_without_signoff_is_no_go(self):
        self.assertEqual(assess(manifest(all_pass=True), NOW)["decision"], "NO-GO")

    def test_credential_and_provenance_stale_are_no_go(self):
        m = manifest(all_pass=True, signed=True)
        m["evidence"]["authorization_security"]["observed_at"] = "2024-01-01T00:00:00Z"
        self.assertEqual(assess(m, NOW)["decision"], "NO-GO")
        m = manifest(all_pass=True, signed=True)
        m["evidence"]["conference_capacity"]["kind"] = "mock_load"
        self.assertEqual(assess(m, NOW)["decision"], "NO-GO")
        m = manifest(all_pass=True, signed=True)
        m["evidence"]["critical_user_journeys"]["edge_version"] = 21
        self.assertEqual(assess(m, NOW)["decision"], "NO-GO")

    def test_all_gates_signed_may_be_metadata_go(self):
        m = manifest(all_pass=True, signed=True)
        result = assess(m, NOW)
        self.assertEqual(result["decision"], "GO")
        self.assertFalse(result["p0_blockers"])

    def test_optional_gates_require_recorded_waiver(self):
        m = manifest(all_pass=True, signed=True)
        m["evidence"].pop("physical_devices")
        self.assertEqual(assess(m, NOW)["decision"], "NO-GO")
        m["accepted_p1_risks"] = ["physical_devices"]
        self.assertEqual(assess(m, NOW)["decision"], "CONDITIONAL GO")

    def test_p0_cannot_be_waived(self):
        m = manifest(all_pass=True, signed=True)
        m["evidence"].pop("recovery_drill")
        m["accepted_p1_risks"] = ["recovery_drill"]
        self.assertEqual(assess(m, NOW)["decision"], "NO-GO")

    def test_reject_wrong_site_or_schema(self):
        m = manifest(all_pass=True, signed=True)
        m["site"] = "https://tamayuz10x.com/cphq/"
        with self.assertRaises(ValueError):
            assess(m, NOW)
        m["site"] = SITE
        m["schema_version"] = 2
        with self.assertRaises(ValueError):
            assess(m, NOW)


if __name__ == "__main__":
    unittest.main()
