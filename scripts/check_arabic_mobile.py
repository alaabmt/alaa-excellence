#!/usr/bin/env python3
"""Render the actual Arabic article at mobile widths and fail on horizontal overflow."""
import asyncio
import json
from pathlib import Path
from playwright.async_api import async_playwright

PAGE = Path("article-agentic-ai-alphaevolve-compute-scheduling.html").resolve()
OUT = Path("editorial-qa/mobile-artifacts")
OUT.mkdir(parents=True, exist_ok=True)

async def main():
    results = []
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        for width in (320, 375, 390, 430):
            page = await browser.new_page(viewport={"width": width, "height": 844}, device_scale_factor=1)
            await page.goto(PAGE.as_uri(), wait_until="load")
            await page.screenshot(path=str(OUT / f"alphaevolve-{width}.png"), full_page=True)
            result = await page.evaluate("""() => ({
                viewport: document.documentElement.clientWidth,
                pageWidth: document.documentElement.scrollWidth,
                h1Visible: !!document.querySelector('h1') && getComputedStyle(document.querySelector('h1')).display !== 'none',
                rtl: document.documentElement.dir === 'rtl',
                tablesScrollable: [...document.querySelectorAll('.table-wrap')].every(x => x.scrollWidth <= x.clientWidth || getComputedStyle(x).overflowX === 'auto')
            })""")
            result["requestedWidth"] = width
            result["pass"] = (result["pageWidth"] <= result["viewport"] + 1 and result["h1Visible"] and result["rtl"] and result["tablesScrollable"])
            results.append(result)
            await page.close()
        await browser.close()
    (OUT / "results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    for result in results: print(result)
    if not all(r["pass"] for r in results):
        raise SystemExit("FAIL: Mobile layout")
    print("PASS: Automated mobile browser layout checks (human visual review still separate)")

if __name__ == "__main__":
    asyncio.run(main())
