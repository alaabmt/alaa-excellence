"""Draft checkpoints must not disable checks on published reflection pages."""
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "reflection_mobile", Path(__file__).resolve().parents[1] / "scripts/check_quran_reflection_mobile.py")
mobile = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mobile)


def published(slug):
    return {"slug": slug, "repository_publish": {
        "arabic_page": {"path": f"{slug}.html"},
        "english_page": {"path": f"en/{slug}.html"}}}


class SelectionTests(unittest.TestCase):
    def select(self, state, files):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "state.json"
            path.write_text(json.dumps(state))
            with patch.object(mobile, "STATE", path), patch.object(
                    Path, "is_file", lambda p: p.as_posix() in files):
                return mobile.current_pages()

    def test_current_publication_has_priority(self):
        self.assertEqual(self.select({"current_article": published("current")},
                         {"current.html", "en/current.html"})[0], "current")

    def test_blocked_draft_checks_previous_publication(self):
        state = {"current_article": {"slug": "draft", "status": "drafts_reviewed_publication_blocked"},
                 "previous_blocked_article": published("previous")}
        before = json.dumps(state)
        self.assertEqual(self.select(state, {"previous.html", "en/previous.html"})[0], "previous")
        self.assertEqual(json.dumps(state), before)

    def test_last_completed_is_a_fallback(self):
        self.assertEqual(self.select({"current_article": {"slug": "draft"},
                         "last_completed_article": published("last")},
                         {"last.html", "en/last.html"})[0], "last")

    def test_partial_publication_cannot_fall_back(self):
        current = published("current")
        del current["repository_publish"]["english_page"]
        with self.assertRaises(SystemExit):
            self.select({"current_article": current, "last_completed_article": published("last")},
                        {"last.html", "en/last.html"})

    def test_public_file_without_publication_record_fails(self):
        with self.assertRaises(SystemExit):
            self.select({"current_article": {"slug": "current"}}, {"current.html"})

    def test_missing_recorded_page_fails(self):
        with self.assertRaises(SystemExit):
            self.select({"current_article": published("current")}, {"current.html"})

    def test_mismatched_paths_fail(self):
        current = published("current")
        current["repository_publish"]["arabic_page"]["path"] = "other.html"
        with self.assertRaises(SystemExit):
            self.select({"current_article": current}, {"other.html", "en/current.html"})

    def test_no_published_pages_fails(self):
        with self.assertRaises(SystemExit):
            self.select({"current_article": {"slug": "draft"}}, set())
