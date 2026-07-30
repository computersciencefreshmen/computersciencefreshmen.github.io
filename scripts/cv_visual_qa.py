"""Browser-level QA for the HSBC casefile and complete CV archive."""

from __future__ import annotations

from pathlib import Path

from playwright.sync_api import Page, sync_playwright

BASE_URL = "http://127.0.0.1:4173/"
ARTIFACTS = Path(__file__).resolve().parents[1] / "artifacts" / "cv-visual-qa"

VIEWPORTS = [
    ("desktop", {"width": 1440, "height": 1000}),
    ("tablet", {"width": 768, "height": 1024}),
    ("mobile", {"width": 390, "height": 844}),
]


def assert_no_horizontal_overflow(page: Page, label: str) -> None:
    dimensions = page.evaluate(
        """() => ({
          viewport: window.innerWidth,
          html: document.documentElement.scrollWidth,
          body: document.body.scrollWidth,
        })"""
    )
    widest = max(dimensions["html"], dimensions["body"])
    if widest > dimensions["viewport"] + 1:
        raise AssertionError(
            f"{label}: horizontal overflow ({widest}px > {dimensions['viewport']}px)"
        )


def assert_counts(page: Page, label: str) -> None:
    expected = {
        ".hsbc-contributions li": 4,
        ".education-card": 2,
        ".archive-entry-grid--three .archive-entry": 3,
        ".archive-entry-grid:not(.archive-entry-grid--three) .archive-entry": 4,
        ".achievement-list li": 5,
    }
    for selector, count in expected.items():
        actual = page.locator(selector).count()
        if actual != count:
            raise AssertionError(
                f"{label}: expected {count} elements for {selector}, found {actual}"
            )


def exercise_viewport(page: Page, label: str) -> None:
    errors: list[str] = []
    page.on("pageerror", lambda error: errors.append(f"pageerror: {error}"))
    page.on(
        "console",
        lambda message: (
            errors.append(f"console.error: {message.text}")
            if message.type == "error"
            else None
        ),
    )

    response = page.goto(BASE_URL, wait_until="networkidle")
    if response is None or not response.ok:
        raise AssertionError(f"{label}: page request failed")

    page.evaluate("document.fonts.ready")
    english_toggle = page.get_by_role("button", name="Switch to English")
    if english_toggle.count() == 1:
        english_toggle.click()
        page.wait_for_timeout(150)

    experience_heading = page.get_by_role(
        "heading", name="Customer data, made actionable."
    )
    experience_heading.scroll_into_view_if_needed()
    page.wait_for_timeout(850)

    if not experience_heading.is_visible():
        raise AssertionError(f"{label}: HSBC flagship heading is not visible")

    if page.get_by_text(
        "CRM Data Analyst Intern · Wealth and Personal Banking"
    ).count() != 1:
        raise AssertionError(f"{label}: HSBC role is missing or duplicated")

    assert_counts(page, label)
    assert_no_horizontal_overflow(page, label)

    broken_images = page.evaluate(
        """() => [...document.images]
          .filter((image) => !image.complete || image.naturalWidth === 0)
          .map((image) => image.currentSrc || image.src)"""
    )
    if broken_images:
        raise AssertionError(f"{label}: broken images: {broken_images}")

    page.screenshot(
        path=str(ARTIFACTS / f"{label}-hsbc.png"),
        full_page=False,
    )

    cv_heading = page.get_by_role(
        "heading", name="The work behind the profile."
    )
    cv_heading.scroll_into_view_if_needed()
    page.wait_for_timeout(850)
    if not cv_heading.is_visible():
        raise AssertionError(f"{label}: full CV archive heading is not visible")

    page.screenshot(
        path=str(ARTIFACTS / f"{label}-cv.png"),
        full_page=False,
    )

    if label == "mobile":
        page.locator("#top").scroll_into_view_if_needed()
        page.get_by_role("button", name="Open navigation").click()
        if not page.get_by_role("link", name="Full CV", exact=True).is_visible():
            raise AssertionError("mobile: expanded CV navigation link is not visible")
        page.get_by_role("link", name="Experience", exact=True).click()
        page.wait_for_timeout(400)

    page.get_by_role("button", name="切换到中文").click()
    if not page.get_by_role(
        "heading", name="让客户数据 转化为行动。"
    ).is_visible():
        page.locator("#experience").scroll_into_view_if_needed()
        page.wait_for_timeout(300)
    if page.get_by_text("汇丰银行").count() < 1:
        raise AssertionError(f"{label}: Chinese HSBC content did not render")

    assert_no_horizontal_overflow(page, f"{label}-zh")
    if errors:
        raise AssertionError(f"{label}: browser errors: {errors}")


def run() -> None:
    ARTIFACTS.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        for label, viewport in VIEWPORTS:
            page = browser.new_page(viewport=viewport, device_scale_factor=1)
            exercise_viewport(page, label)
            page.close()

        pdf_response = playwright.request.new_context().get(
            f"{BASE_URL}Hanyu_Yang_CV_Public.pdf"
        )
        if not pdf_response.ok:
            raise AssertionError(
                f"Public CV request failed with {pdf_response.status}"
            )
        if len(pdf_response.body()) < 10_000:
            raise AssertionError("Public CV response is unexpectedly small")
        content_type = pdf_response.headers.get("content-type", "")
        if "application/pdf" not in content_type:
            raise AssertionError(
                f"Public CV has unexpected content type: {content_type}"
            )

        browser.close()

    print("CV visual QA passed for desktop, tablet, and mobile.")


if __name__ == "__main__":
    run()
