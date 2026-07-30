from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4173"
OUTPUT_DIR = Path("artifacts/qa")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def reveal_entire_page(page) -> None:
    total_height = page.evaluate("document.documentElement.scrollHeight")
    for position in range(0, total_height + 700, 700):
        page.evaluate(f"window.scrollTo(0, {position})")
        page.wait_for_timeout(90)
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(180)


def run() -> None:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        desktop_context = browser.new_context(
            viewport={"width": 1440, "height": 1000}, locale="en-US"
        )
        desktop = desktop_context.new_page()
        desktop.add_init_script(
            "window.localStorage.setItem('hanyu-portfolio-locale', 'en')"
        )
        desktop.goto(BASE_URL, wait_until="networkidle")
        reveal_entire_page(desktop)

        for order, selector, label in [
            ("01", ".hero", "hero-desktop"),
            ("02", "#work", "work-desktop"),
            ("03", "#about", "about-desktop"),
            ("04", "#contact", "contact-desktop"),
        ]:
            desktop.locator(selector).screenshot(
                path=OUTPUT_DIR / f"{order}-{label}.png"
            )
        desktop_context.close()

        mobile_context = browser.new_context(
            viewport={"width": 390, "height": 844}, locale="en-US"
        )
        mobile = mobile_context.new_page()
        mobile.add_init_script(
            "window.localStorage.setItem('hanyu-portfolio-locale', 'en')"
        )
        mobile.goto(BASE_URL, wait_until="networkidle")
        reveal_entire_page(mobile)
        mobile.get_by_role("button", name="Open navigation", exact=True).click()
        mobile.screenshot(path=OUTPUT_DIR / "05-mobile-menu.png")
        mobile.get_by_role("button", name="切换到中文", exact=True).click()
        mobile.locator(".hero").screenshot(path=OUTPUT_DIR / "06-hero-mobile-zh.png")
        mobile_context.close()

        browser.close()


if __name__ == "__main__":
    run()
