import json

from playwright.sync_api import sync_playwright


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.add_init_script(
        "window.localStorage.setItem('hanyu-portfolio-locale', 'en')"
    )
    page.goto("http://127.0.0.1:4173", wait_until="networkidle")

    reveals = page.locator(".reveal")
    states = []
    for index in range(reveals.count()):
        reveal = reveals.nth(index)
        reveal.scroll_into_view_if_needed()
        page.wait_for_timeout(160)
        states.append(
            {
                "index": index,
                "visible": "is-visible" in (reveal.get_attribute("class") or ""),
                "text": (reveal.inner_text() or "").strip().replace("\n", " ")[:80],
            }
        )

    print(
        json.dumps(
            {
                "total": len(states),
                "hidden": [state for state in states if not state["visible"]],
            },
            ensure_ascii=False,
            indent=2,
        )
    )
    browser.close()
