"""Print the readable text of an article page (title + main body), without scripts, nav, footer or references."""
import sys
from html.parser import HTMLParser

SKIP = {"script", "style", "nav", "footer", "header", "noscript", "svg", "form"}

class P(HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.out = []
        self.title = ""
        self.in_title = False
    def handle_starttag(self, tag, attrs):
        if tag in SKIP:
            self.depth += 1
        if tag == "title":
            self.in_title = True
        if tag in ("p", "h1", "h2", "h3", "li", "div", "br", "tr"):
            self.out.append("\n")
    def handle_endtag(self, tag):
        if tag in SKIP and self.depth:
            self.depth -= 1
        if tag == "title":
            self.in_title = False
    def handle_data(self, data):
        if self.in_title:
            self.title += data
        elif not self.depth:
            self.out.append(data)

p = P()
p.feed(open(sys.argv[1], encoding="utf-8").read())
text = "".join(p.out)
lines = [" ".join(l.split()) for l in text.splitlines()]
body = "\n".join(l for l in lines if l)
cut = min([i for i in (body.find("\nالمراجع\n"), body.find("\nReferences\n")) if i > 0] or [len(body)])
print("TITLE:", p.title.strip())
print(body[:cut])
