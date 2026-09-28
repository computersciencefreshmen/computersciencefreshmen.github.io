"""Verify the production build (or deployed URL) across locales and widths."""
import argparse
import json
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

def run(base_url: str, output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    locales = ('en', 'zh', 'de', 'fr', 'it', 'ru', 'es', 'uk')
    routes = ('', 'work', 'research', 'experience', 'cv', 'contact')
    errors, checks = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in (320, 390, 768, 1440):
            context = browser.new_context(viewport={'width': width, 'height': 1000}, color_scheme='light')
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
            for locale in locales:
                for route in routes:
                    page.goto(f'{base_url}/?lang={locale}#/{route}', wait_until='domcontentloaded')
                    heading = page.get_by_role('heading', level=1)
                    expect(heading).to_be_visible()
                    expect(page.locator('html')).to_have_attribute('lang', 'zh-CN' if locale == 'zh' else locale)
                    page.evaluate('document.fonts.ready')
                    metrics = page.evaluate('''() => ({ viewport: innerWidth, width: document.documentElement.scrollWidth,
                        font: getComputedStyle(document.querySelector('h1')).fontFamily,
                        size: getComputedStyle(document.querySelector('h1')).fontSize,
                        fontReady: document.fonts.check('16px "Inter Variable"') })''')
                    assert metrics['width'] <= metrics['viewport'] + 1, (locale, route, width, metrics)
                    assert metrics['font'].startswith('"Inter Variable"'), metrics
                    assert metrics['fontReady'], metrics
                    assert page.locator('.language-picker [role="option"]').count() == 8
                    checks.append({'locale': locale, 'route': route or 'home', 'width': width, 'heading': heading.inner_text(), **metrics})
                    if route == '' and (width == 1440 and locale in ('en', 'de', 'uk') or width == 390 and locale in ('en', 'fr', 'ru', 'zh')):
                        page.screenshot(path=str(output / f'home-{locale}-{width}.png'), full_page=True, animations='disabled')
                # Switching keeps the route and the preference survives a refresh.
                page.get_by_role('combobox').click()
                page.locator(f'[role="option"][data-value="{locale}"]').click()
                page.reload(wait_until='domcontentloaded')
                expect(page.get_by_role('combobox')).to_have_attribute('data-value', locale)
                assert page.url.endswith('#/contact')
                page.locator('.theme-toggle').click()
                expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
                page.locator('.theme-toggle').click()
            if width <= 1100:
                menu = page.locator('.menu-button')
                menu.click()
                expect(page.locator('#primary-navigation')).to_be_visible()
                page.keyboard.press('Escape')
                expect(menu).to_be_focused()
                expect(page.locator('#primary-navigation')).not_to_be_visible()
                menu.click()
                page.locator('#primary-navigation a[href="#/work"]').click()
                expect(menu).to_have_attribute('aria-expanded', 'false')
                expect(page.locator('#main-content')).to_be_focused()
            context.close()
        context = browser.new_context()
        page = context.new_page()
        page.goto(f'{base_url}/?lang=ua#/research')
        expect(page.locator('html')).to_have_attribute('lang', 'uk')
        pdf = context.request.get(f'{base_url}/Hanyu_Yang_CV_Public.pdf')
        assert pdf.status == 200 and pdf.body().startswith(b'%PDF')
        context.close()
        browser.close()
    result = {'routes_checked': len(checks), 'languages': list(locales), 'errors': errors, 'checks': checks}
    (output / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    assert not errors, errors
    print(json.dumps({'routes_checked': len(checks), 'languages': list(locales), 'errors': errors, 'pdf': 'ok'}))

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--output', type=Path, default=Path('artifacts/multilingual-qa'))
    args = parser.parse_args()
    run(args.url.rstrip('/'), args.output)
