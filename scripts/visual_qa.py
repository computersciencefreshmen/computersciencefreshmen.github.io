import json
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


BASE_URL = "http://127.0.0.1:4173"
OUTPUT_DIR = Path("artifacts/qa")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
ROUTES = ("", "work", "research", "experience", "cv", "contact")


def assert_no_overflow(page, label: str) -> None:
    widths = page.evaluate(
        "() => [document.documentElement.clientWidth, document.documentElement.scrollWidth]"
    )
    if widths[1] > widths[0] + 1:
        raise AssertionError(f"{label} overflow: viewport={widths[0]}, content={widths[1]}")


def snapshot(page, name: str) -> None:
    page.evaluate("document.fonts.ready")
    page.screenshot(path=OUTPUT_DIR / name, full_page=True, animations="disabled")


def visit(page, route: str) -> str:
    page.goto(f"{BASE_URL}/#/{route}", wait_until="networkidle")
    heading = page.get_by_role("heading", level=1)
    expect(heading).to_have_count(1)
    expect(heading).to_be_visible()
    expect(page.locator("#primary-navigation [aria-current='page']")).to_have_count(1)
    expect(page.locator("#primary-navigation [aria-current='page']")).to_have_attribute(
        "href", f"#/{route}"
    )
    return heading.inner_text().replace("\n", " ")


def run() -> None:
    console_errors = []
    page_errors = []
    route_checks = []

    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)

        def new_page(width, height, locale="en"):
            context = browser.new_context(
                viewport={"width": width, "height": height},
                locale="en-US" if locale == "en" else "zh-CN",
                color_scheme="light",
            )
            context.add_init_script(
                "window.localStorage.setItem('hanyu-portfolio-locale', "
                + json.dumps(locale)
                + "); window.localStorage.setItem('hanyu-portfolio-theme', 'light');"
            )
            page = context.new_page()
            label = f"{width}px {locale}"
            page.on(
                "console",
                lambda message: console_errors.append(f"{label}: {message.text}")
                if message.type == "error"
                else None,
            )
            page.on("pageerror", lambda error: page_errors.append(f"{label}: {error}"))
            return context, page

        def check_routes(page, width, locale):
            headings = []
            for route in ROUTES:
                heading = visit(page, route)
                assert_no_overflow(page, f"{width}px {locale} {route or 'home'}")
                headings.append(heading)
                route_checks.append({"width": width, "locale": locale, "route": route or "home", "h1": heading})
            if len(set(headings)) != len(ROUTES):
                raise AssertionError(f"Page titles are not unique: {headings}")

        desktop_context, desktop = new_page(1440, 1000)
        response = desktop.goto(BASE_URL, wait_until="networkidle")
        assert response and response.status == 200, "Home did not return HTTP 200"
        expect(desktop.locator(".featured-card")).to_have_count(3)
        portrait = desktop.locator(".hero__portrait img")
        expect(portrait).to_be_visible()
        desktop.wait_for_function(
            "() => { const image = document.querySelector('.hero__portrait img'); return image && image.complete && image.naturalWidth > 0; }"
        )
        assert_no_overflow(desktop, "desktop home")
        snapshot(desktop, "01-home-desktop.png")

        visit(desktop, "work")
        expect(desktop.locator(".project-card")).to_have_count(5)
        snapshot(desktop, "02-work-desktop.png")
        search = desktop.get_by_role("searchbox", name="Search projects")
        search.fill("BERT")
        expect(desktop.locator(".project-card")).to_have_count(1)
        expect(desktop.locator(".project-card h2")).to_have_text("YouTube Sentiment Analysis")
        desktop.get_by_role("button", name="Research 1", exact=True).click()
        expect(desktop.locator(".project-card")).to_have_count(1)
        search.fill("no-project-matches-this-query")
        expect(desktop.locator(".project-card")).to_have_count(0)
        expect(desktop.get_by_role("heading", name="No projects found")).to_be_visible()
        desktop.get_by_role("button", name="Show all projects", exact=True).click()
        expect(search).to_have_value("")
        expect(desktop.locator(".project-card")).to_have_count(5)
        expect(desktop.get_by_role("button", name="All 5", exact=True)).to_have_attribute("aria-pressed", "true")
        desktop.get_by_role("button", name="Products 4", exact=True).click()
        expect(desktop.locator(".project-card")).to_have_count(4)
        desktop.get_by_role("button", name="Clear filters", exact=True).click()
        expect(desktop.locator(".project-card")).to_have_count(5)

        check_routes(desktop, 1440, "en")
        visit(desktop, "")
        desktop.get_by_role("button", name="Switch to dark theme", exact=True).click()
        expect(desktop.locator("html")).to_have_attribute("data-theme", "dark")
        snapshot(desktop, "03-home-dark.png")
        assert_no_overflow(desktop, "desktop dark")
        desktop.get_by_role("button", name="Switch to light theme", exact=True).click()
        desktop.get_by_role("button", name="切换到中文", exact=True).click()
        expect(desktop.locator("html")).to_have_attribute("lang", "zh-CN")
        snapshot(desktop, "05-home-desktop-zh.png")
        # The context init script deliberately resets language on full navigation;
        # route clicks below retain the toggle and test client-side Chinese routing.
        chinese_headings = []
        for route in ROUTES:
            desktop.locator(f"#primary-navigation a[href='#/{route}']").click()
            expect(desktop.get_by_role("heading", level=1)).to_have_count(1)
            expect(desktop.locator("html")).to_have_attribute("lang", "zh-CN")
            assert_no_overflow(desktop, f"1440px zh {route or 'home'}")
            heading = desktop.get_by_role("heading", level=1).inner_text().replace("\n", " ")
            chinese_headings.append(heading)
            route_checks.append({"width": 1440, "locale": "zh", "route": route or "home", "h1": heading})
        assert len(set(chinese_headings)) == len(ROUTES)
        pdf_response = desktop_context.request.get(f"{BASE_URL}/Hanyu_Yang_CV_Public.pdf")
        assert pdf_response.status == 200, f"CV response: {pdf_response.status}"
        assert pdf_response.body().startswith(b"%PDF"), "CV response was not a PDF"
        desktop_context.close()

        menu_result = {}
        for width in (390, 320):
            for locale in ("en", "zh"):
                context, page = new_page(width, 844, locale)
                check_routes(page, width, locale)
                visit(page, "")
                if width == 390 and locale == "zh":
                    snapshot(page, "04-home-mobile-zh.png")
                if width == 320 and locale == "zh":
                    snapshot(page, "07-home-320-zh.png")
                if width == 390 and locale == "en":
                    menu = page.locator(".menu-button")
                    menu.click()
                    expect(menu).to_have_attribute("aria-expanded", "true")
                    navigation = page.locator("#primary-navigation")
                    expect(navigation).to_be_visible()
                    snapshot(page, "06-mobile-menu.png")
                    page.keyboard.press("Escape")
                    expect(menu).to_have_attribute("aria-expanded", "false")
                    expect(menu).to_be_focused()
                    expect(navigation).not_to_be_visible()
                    menu.press("Enter")
                    research_link = navigation.locator("a[href=\"#/research\"]")
                    research_link.focus()
                    research_link.press("Enter")
                    expect(page.get_by_role("heading", name="Research", exact=True, level=1)).to_be_visible()
                    expect(menu).to_have_attribute("aria-expanded", "false")
                    expect(navigation).not_to_be_visible()
                    expect(page.locator("#main-content")).to_be_focused()
                    expect(research_link).to_have_attribute("aria-current", "page")
                    menu_result = {"escape_closes": True, "escape_restores_focus": True, "keyboard_route_closes": True, "route_focuses_main": True}
                    snapshot(page, "08-research-mobile.png")
                context.close()
        browser.close()

    result = {
        "desktop": {"status": response.status, "featured_projects": 3, "all_projects": 5, "portrait_loaded": True, "search_filter_reset": True, "pdf_status": pdf_response.status},
        "mobile_menu": menu_result,
        "route_checks": route_checks,
        "console_errors": console_errors,
        "page_errors": page_errors,
    }
    (OUTPUT_DIR / "results.json").write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    if console_errors or page_errors:
        raise AssertionError(json.dumps(result, ensure_ascii=False, indent=2))
    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    run()
