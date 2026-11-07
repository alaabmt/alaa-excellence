"""Check that a verse appears character for character inside ﴿…﴾ in the article.

Usage: python3 -I verify_verse.py <article.html> "<verse text without ﴿﴾>"
Exit code 0 only on an exact match. Never retype or "correct" a verse; copy it from the article.
"""
import html
import re
import sys
import unicodedata

# NFC only fixes the storage order of diacritics (for example shadda + fatha); it never changes letters.
norm = lambda t: unicodedata.normalize("NFC", t)
page = norm(html.unescape(open(sys.argv[1], encoding="utf-8").read()))
verse = norm(sys.argv[2].strip())
quoted = re.findall(r"﴿([^﴾]+)﴾", page)
if any(verse == q.strip() or verse in q for q in quoted):
    print("OK: exact match inside ﴿﴾")
    sys.exit(0)
print("FAIL: this exact text is not in the article between ﴿﴾. Copy the verse from the article again.")
sys.exit(1)
