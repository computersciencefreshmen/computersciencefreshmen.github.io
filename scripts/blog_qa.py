"""Check full article translations and synchronized selectors locally or live."""
import argparse
import hashlib
import json
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ('en', 'zh', 'de', 'fr', 'it', 'ru', 'es', 'uk')
TITLES = {
    'en': 'Death & the Maiden: Beyond the Strings',
    'zh': 'Death & the Maiden｜弦外之音',
}
TRANSLATIONS = {}
for code in LOCALES[2:]:
    TRANSLATIONS[code] = json.loads((ROOT / f'src/data/blog-locales/{code}.json').read_text(encoding='utf-8'))
    TITLES[code] = TRANSLATIONS[code]['title']


def run(base_url: str, output: Path, widths: tuple[int, ...]) -> None:
    output.mkdir(parents=True, exist_ok=True)
    checks, errors = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in widths:
            context = browser.new_context(viewport={'width': width, 'height': 1000})
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
            for index, code in enumerate(LOCALES):
                page.goto(f'{base_url}/?lang={code}#/blog/death-and-the-maiden', wait_until='networkidle')
                tag = 'zh-CN' if code == 'zh' else code
                expect(page.locator('article.blog-article')).to_have_attribute('lang', tag)
                expect(page.get_by_role('heading', level=1)).to_have_text(TITLES[code])
                assert TITLES[code] in page.title()
                for selector in page.get_by_role('combobox').all():
                    expect(selector).to_have_attribute('data-value', code)
                if code in TRANSLATIONS:
                    content = TRANSLATIONS[code]
                    for paragraph in content['paragraphs']:
                        expect(page.get_by_text(paragraph, exact=True)).to_be_visible()
                    expect(page.locator('meta[name="description"]')).to_have_attribute('content', content['excerpt'])
                    expect(page.locator('.blog-article__cover figcaption')).to_have_text(content['coverCaption'])
                    expect(page.locator('.blog-programme img')).to_have_attribute('alt', content['programmeAlt'])
                for photo in page.locator('article img').all():
                    photo.scroll_into_view_if_needed()
                    assert photo.evaluate('(img) => img.complete && img.naturalWidth > 0')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (code, width)
                page.evaluate('document.fonts.ready')
                page.evaluate('window.scrollTo(0, 0)')
                if width in (390, 1440) and code in ('de', 'fr', 'ru', 'uk'):
                    page.screenshot(path=str(output / f'article-{code}-{width}.png'), full_page=True, animations='disabled')
                article_selector = page.locator('.blog-language .language-select')
                article_selector.click()
                expect(page.locator('.blog-language [role="option"]')).to_have_count(8)
                next_code = LOCALES[(index + 1) % len(LOCALES)]
                page.locator(f'.blog-language [role="option"][data-value="{next_code}"]').click()
                expect(page.get_by_role('heading', level=1)).to_have_text(TITLES[next_code])
                expect(page.locator('.site-header .language-select')).to_have_attribute('data-value', next_code)
                assert page.url.endswith('#/blog/death-and-the-maiden')
                page.reload(wait_until='networkidle')
                expect(page.get_by_role('heading', level=1)).to_have_text(TITLES[next_code])
                # The site selector drives the same article state in the other direction.
                page.locator('.site-header .language-select').click()
                page.locator(f'.site-header [role="option"][data-value="{code}"]').click()
                expect(article_selector).to_have_attribute('data-value', code)
                expect(page.get_by_role('heading', level=1)).to_have_text(TITLES[code])
                article_selector.click()
                page.keyboard.press('Escape')
                expect(article_selector).to_be_focused()
                expect(article_selector).to_have_attribute('aria-expanded', 'false')
                page.locator('.theme-toggle').click()
                expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
                page.locator('.theme-toggle').click()
                checks.append({'locale': code, 'width': width, 'prose': 'translated', 'selectors_refresh': 'ok'})
            response = context.request.get(f'{base_url}/Hanyu_Yang_CV_Public.pdf')
            assert response.status == 200
            assert hashlib.sha256(response.body()).digest() == hashlib.sha256((ROOT / 'public/Hanyu_Yang_CV_Public.pdf').read_bytes()).digest(), 'Published CV differs from verified local PDF'
            page.goto(f'{base_url}/?lang=en#/cv', wait_until='networkidle')
            expect(page.get_by_text('GPA: 88/100 · Top 10%.', exact=True)).to_be_visible()
            assert 'Incoming postgraduate' not in page.locator('main').inner_text()
            context.close()
        browser.close()
    assert not errors, errors
    result = {'article_checks': len(checks), 'languages': list(LOCALES), 'errors': errors, 'public_cv': 'matches verified PDF', 'checks': checks}
    (output / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({key: value for key, value in result.items() if key != 'checks'}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--output', type=Path, default=Path('artifacts/blog-qa'))
    parser.add_argument('--widths', nargs='+', type=int, default=[320, 390, 768, 1440])
    args = parser.parse_args()
    run(args.url.rstrip('/'), args.output, tuple(args.widths))
