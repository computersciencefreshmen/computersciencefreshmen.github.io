"""Exercise real downloads in all eight languages on mobile and desktop."""

import argparse
import hashlib
import json
from pathlib import Path

from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("en", "zh", "de", "fr", "it", "ru", "es", "uk")


def pdf_url(code: str) -> str:
    return "/Hanyu_Yang_CV_Public.pdf" if code == "en" else f"/cv/Hanyu_Yang_CV_Public_{code}.pdf"


def run(base_url: str, output: Path, widths: list[int]) -> None:
    output.mkdir(parents=True, exist_ok=True)
    checks, errors = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in widths:
            context = browser.new_context(viewport={"width": width, "height": 1000}, accept_downloads=True)
            page = context.new_page()
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
            for code in LOCALES:
                expected = pdf_url(code)
                local_bytes = (ROOT / "public" / expected.lstrip("/")).read_bytes()
                for route in ("", "cv", "experience"):
                    page.goto(f"{base_url}/?lang={code}#/{route}", wait_until="networkidle")
                    link = page.locator(f'a[href="{expected}"]')
                    expect(link).to_have_count(1)
                    expect(link).to_be_visible()
                    assert page.evaluate("document.documentElement.scrollWidth <= innerWidth + 1"), (code, route, width)
                    if route != "experience":
                        with page.expect_download() as event:
                            link.click()
                        download = event.value
                        assert download.failure() is None
                        saved = output / f"{code}-{route or 'home'}-{width}.pdf"
                        download.save_as(saved)
                        actual_bytes = saved.read_bytes()
                        assert download.suggested_filename == expected.rsplit("/", 1)[-1]
                    else:
                        # This CTA intentionally opens the selected PDF in a new tab.
                        response = context.request.get(f"{base_url}{expected}")
                        assert response.status == 200
                        actual_bytes = response.body()
                    assert hashlib.sha256(actual_bytes).digest() == hashlib.sha256(local_bytes).digest(), (code, route, "wrong or stale PDF")
                    # Changing language must update the same CTA without changing route.
                    next_code = LOCALES[(LOCALES.index(code) + 1) % len(LOCALES)]
                    page.locator(".site-header .language-select").click()
                    page.locator(f'.site-header [role="option"][data-value="{next_code}"]').click()
                    expect(page.locator(f'a[href="{pdf_url(next_code)}"]')).to_have_count(1)
                    assert page.url.endswith(f"#/{route}")
                    checks.append({"locale": code, "route": route or "home", "width": width, "pdf": expected, "content_sha256": hashlib.sha256(local_bytes).hexdigest(), "switching": "ok"})
            # Explicitly exercise default English with an old preference present.
            page.evaluate('localStorage.setItem("hanyu-portfolio-locale", "uk")')
            page.goto(f"{base_url}/#/cv", wait_until="networkidle")
            expect(page.locator(".site-header .language-select")).to_have_attribute("data-value", "en")
            expect(page.locator('a[href="/Hanyu_Yang_CV_Public.pdf"]')).to_have_count(1)
            context.close()
        browser.close()
    assert not errors, errors
    result = {"download_checks": len(checks), "languages": list(LOCALES), "default": "en", "errors": errors, "checks": checks}
    (output / "results.json").write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps({key: value for key, value in result.items() if key != "checks"}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", default="http://127.0.0.1:4173")
    parser.add_argument("--output", type=Path, default=Path("artifacts/cv-download-qa"))
    parser.add_argument("--widths", type=int, nargs="+", default=[390, 1440])
    args = parser.parse_args()
    run(args.url.rstrip("/"), args.output, args.widths)
