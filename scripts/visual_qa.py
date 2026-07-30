import json
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = "http://127.0.0.1:4173"
OUTPUT_DIR = Path("artifacts/qa")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def assert_no_overflow(page, label: str) -> None:
    widths = page.evaluate(
        "() => [document.documentElement.clientWidth, document.documentElement.scrollWidth]"
    )
    if widths[1] > widths[0] + 1:
        raise AssertionError(f"{label} overflow: viewport={widths[0]}, content={widths[1]}")


def open_english_page(browser, viewport):
    context = browser.new_context(viewport=viewport, locale="en-US")
    page = context.new_page()
    page.add_init_script(
        "window.localStorage.setItem('hanyu-portfolio-locale', 'en')"
    )
    return context, page


def run() -> None:
    console_errors = []
    page_errors = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        desktop_context, desktop = open_english_page(
            browser, {"width": 1440, "height": 1000}
        )
        desktop.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        desktop.on("pageerror", lambda error: page_errors.append(str(error)))
        desktop_response = desktop.goto(BASE_URL, wait_until="networkidle")
        desktop.get_by_role("heading", level=1).wait_for()
        desktop.locator(".portrait-card img").wait_for()

        desktop_result = {
            "status": desktop_response.status if desktop_response else None,
            "projects": desktop.locator(".project-card").count(),
            "external_links": desktop.locator('a[target="_blank"]').count(),
            "language": desktop.locator("html").get_attribute("lang"),
            "portrait_loaded": desktop.locator(".portrait-card img").evaluate(
                "(image) => image.complete && image.naturalWidth > 0"
            ),
        }
        if desktop_result["status"] != 200 or desktop_result["projects"] != 5:
            raise AssertionError(f"Desktop smoke failed: {desktop_result}")

        assert_no_overflow(desktop, "desktop")
        for order, selector, label in [
            ("01", ".hero", "hero-desktop"),
            ("02", "#work", "work-desktop"),
            ("03", "#about", "about-desktop"),
            ("04", "#contact", "contact-desktop"),
        ]:
            section = desktop.locator(selector)
            section.scroll_into_view_if_needed()
            desktop.wait_for_timeout(650)
            desktop.screenshot(
                path=OUTPUT_DIR / f"{order}-{label}.png"
            )
        desktop_context.close()

        mobile_context, mobile = open_english_page(
            browser, {"width": 390, "height": 844}
        )
        mobile.on(
            "console",
            lambda message: console_errors.append(f"mobile: {message.text}")
            if message.type == "error"
            else None,
        )
        mobile.on("pageerror", lambda error: page_errors.append(f"mobile: {error}"))
        mobile_response = mobile.goto(BASE_URL, wait_until="networkidle")
        mobile.get_by_role("button", name="Open navigation", exact=True).click()

        navigation = mobile.get_by_role("navigation", name="Primary navigation")
        navigation_element = mobile.locator("#primary-navigation")
        if "is-open" not in (navigation_element.get_attribute("class") or ""):
            raise AssertionError("Mobile menu did not enter its open state")
        mobile.screenshot(path=OUTPUT_DIR / "05-mobile-menu.png")

        mobile.keyboard.press("Escape")
        mobile.wait_for_timeout(320)
        if "is-open" in (navigation_element.get_attribute("class") or ""):
            raise AssertionError("Escape did not close the mobile menu")
        closed_menu_state = navigation_element.evaluate(
            """(element) => ({
              visibility: getComputedStyle(element).visibility,
              pointerEvents: getComputedStyle(element).pointerEvents,
            })"""
        )
        if closed_menu_state != {"visibility": "hidden", "pointerEvents": "none"}:
            raise AssertionError(f"Closed menu remains interactive: {closed_menu_state}")

        mobile.get_by_role("button", name="Open navigation", exact=True).click()
        navigation.get_by_role("link", name="Selected work", exact=True).click()
        mobile.wait_for_timeout(250)
        assert_no_overflow(mobile, "mobile")

        mobile.get_by_role("button", name="切换到中文", exact=True).click()
        mobile.get_by_role("button", name="打开导航", exact=True).click()
        mobile.get_by_role("link", name="精选项目", exact=True).wait_for()
        mobile.keyboard.press("Escape")
        mobile.locator("#top").scroll_into_view_if_needed()
        mobile.wait_for_timeout(320)
        mobile.screenshot(path=OUTPUT_DIR / "06-hero-mobile-zh.png")

        mobile_result = {
            "status": mobile_response.status if mobile_response else None,
            "language_after_toggle": mobile.locator("html").get_attribute("lang"),
            "menu_tested": True,
            "overflow_free": True,
        }
        if mobile_result["status"] != 200 or mobile_result["language_after_toggle"] != "zh-CN":
            raise AssertionError(f"Mobile smoke failed: {mobile_result}")

        mobile_context.close()
        browser.close()

    result = {
        "desktop": desktop_result,
        "mobile": mobile_result,
        "console_errors": console_errors,
        "page_errors": page_errors,
    }
    if console_errors or page_errors:
        raise AssertionError(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    run()
