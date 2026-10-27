#!/usr/bin/env python3
"""Render the current bilingual Qur'anic reflection at real mobile widths."""
import asyncio
import json
import subprocess
import time
from pathlib import Path

from playwright.async_api import async_playwright

STATE = Path("automation/quran-reflections-state.json")
OUT = Path("editorial-qa/mobile-artifacts")
WIDTHS = (320, 375, 390, 430)


def current_pages():
    state = json.loads(STATE.read_text(encoding="utf-8"))
    article = state.get("current_article") or {}
    publish = article.get("repository_publish") or {}
    arabic = (publish.get("arabic_page") or {}).get("path")
    english = (publish.get("english_page") or {}).get("path")
    slug = article.get("slug")
    if not slug or not arabic or not english:
        raise SystemExit("FAIL: Current reflection publication paths are missing from state")
    return slug, (("ar", "rtl", Path(arabic)), ("en", "ltr", Path(english)))


async def main():
    slug, pages = current_pages()
    OUT.mkdir(parents=True, exist_ok=True)
    results = []
    server = subprocess.Popen(
        ["python3", "-m", "http.server", "8765", "--bind", "127.0.0.1"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1)
    try:
        async with async_playwright() as playwright:
            browser = await playwright.chromium.launch(headless=True)
            for language, direction, page_path in pages:
                if not page_path.is_file():
                    raise RuntimeError(f"Missing reflection page: {page_path}")
                for width in WIDTHS:
                    page = await browser.new_page(
                        viewport={"width": width, "height": 844},
                        device_scale_factor=1,
                    )
                    response = await page.goto(
                        "http://127.0.0.1:8765/" + page_path.as_posix(),
                        wait_until="networkidle",
                    )
                    if response is None or response.status != 200:
                        raise RuntimeError(f"HTTP failure for {page_path} at {width}px")
                    evidence = await page.evaluate(
                        """async ({language, direction}) => {
                            const assets = [...document.querySelectorAll(
                                'link[rel="stylesheet"], script[src], img[src]'
                            )];
                            const paths = assets
                                .map(node => node.getAttribute('href') || node.getAttribute('src'))
                                .filter(value => value && value.startsWith('/'));
                            const statuses = await Promise.all(
                                paths.map(async value => (await fetch(value)).status)
                            );
                            const h1 = document.querySelector('h1');
                            const buttons = [...document.querySelectorAll('button')]
                                .map(button => (
                                    button.innerText || button.getAttribute('aria-label') || ''
                                ).trim());
                            const listenPattern = language === 'ar' ? /استمع/ : /listen/i;
                            return {
                                viewport: document.documentElement.clientWidth,
                                pageWidth: document.documentElement.scrollWidth,
                                h1Visible: !!h1 && !!(
                                    h1.offsetWidth || h1.offsetHeight || h1.getClientRects().length
                                ),
                                lang: document.documentElement.lang,
                                dir: document.documentElement.dir,
                                expectedLang: language,
                                expectedDir: direction,
                                assetsOk: statuses.every(status => status === 200),
                                tablesScrollable: [...document.querySelectorAll('.table-wrap')]
                                    .every(node => (
                                        node.scrollWidth <= node.clientWidth ||
                                        getComputedStyle(node).overflowX === 'auto'
                                    )),
                                listenControl: buttons.some(text => listenPattern.test(text)),
                            };
                        }""",
                        {"language": language, "direction": direction},
                    )
                    evidence["language"] = language
                    evidence["requestedWidth"] = width
                    evidence["pass"] = (
                        evidence["pageWidth"] <= evidence["viewport"] + 1
                        and evidence["h1Visible"]
                        and evidence["lang"] == language
                        and evidence["dir"] == direction
                        and evidence["assetsOk"]
                        and evidence["tablesScrollable"]
                        and evidence["listenControl"]
                    )
                    results.append(evidence)
                    await page.screenshot(
                        path=str(OUT / f"{slug}-{language}-{width}.png"),
                        full_page=True,
                    )
                    await page.close()
            await browser.close()
    finally:
        server.terminate()
        server.wait(timeout=10)

    result_path = OUT / f"{slug}-bilingual-results.json"
    result_path.write_text(
        json.dumps(results, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    for result in results:
        print(result)
    if not all(result["pass"] for result in results):
        raise SystemExit("FAIL: Current reflection mobile layout")
    print(f"PASS: Bilingual reflection mobile layout evidence saved to {result_path}")


if __name__ == "__main__":
    asyncio.run(main())
