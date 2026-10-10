"""Check every essay's translated prose, photographs and synchronized selectors."""
import argparse
import hashlib
import json
import subprocess
from pathlib import Path
from playwright.sync_api import expect, sync_playwright

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ('en', 'zh', 'de', 'fr', 'it', 'ru', 'es', 'uk')
DEFAULT_SLUGS = ('between-tides-and-twilight', 'death-and-the-maiden')
TRAVEL_PHOTOS = [
    '/blog/between-tides-and-twilight/victoria-harbour-sunset.webp',
    '/blog/between-tides-and-twilight/peel-street-evening.webp',
    '/blog/between-tides-and-twilight/victoria-park-star-lanterns.webp',
    '/blog/between-tides-and-twilight/hong-kong-island-night.webp',
    '/blog/between-tides-and-twilight/happy-valley-racing.webp',
]


def load_posts() -> dict:
    # Vite resolves TypeScript and JSON using the production application's rules.
    # Avoid a second prose catalog in QA that could drift from the actual records.
    result = subprocess.run(
        ['node', 'scripts/export_blog_qa.mjs'], cwd=ROOT,
        check=True, capture_output=True, text=True, encoding='utf-8',
    )
    posts = json.loads(result.stdout)
    for post in posts:
        assert set(post['content']) == set(LOCALES), f"Missing locales: {post['slug']}"
        for code in LOCALES:
            content = post['content'][code]
            assert len(content['paragraphs']) == 2, (post['slug'], code)
            assert len(content['gallery']) == len(post['gallery']), (post['slug'], code)
            assert all(paragraph.strip() for paragraph in content['paragraphs'])
            assert all(photo['alt'].strip() and photo['caption'].strip() for photo in content['gallery'])
            if code != 'en':
                assert content['paragraphs'][0] != post['content']['en']['paragraphs'][0]
    return {post['slug']: post for post in posts}


def check_article(page, post: dict, code: str, width: int) -> None:
    content = post['content'][code]
    tag = 'zh-CN' if code == 'zh' else code
    article = page.locator('article.blog-article')
    expect(article).to_have_attribute('lang', tag)
    expect(page.locator('html')).to_have_attribute('lang', tag)
    expect(page.get_by_role('heading', level=1)).to_have_text(content['title'])
    assert content['title'] in page.title()
    expect(page.locator('meta[name="description"]')).to_have_attribute('content', content['excerpt'])
    expect(page.get_by_role('combobox')).to_have_count(2)
    for selector in page.get_by_role('combobox').all():
        expect(selector).to_have_attribute('data-value', code)
    for paragraph in [*content['paragraphs'], content['closing']]:
        expect(article.get_by_text(paragraph, exact=True)).to_be_visible()
    expect(article.locator('.blog-tags li')).to_have_text(content['tags'])
    expect(article.locator('time')).to_have_count(2 if post.get('concertDate') else 1)
    expect(article.locator(f'time[datetime="{post["publishedAt"]}"]')).to_have_count(1)
    if post.get('concertDate'):
        expect(article.locator(f'time[datetime="{post["concertDate"]}"]')).to_have_count(1)
    source = post.get('source')
    if source:
        expect(article.get_by_role('link', name=source['label'])).to_have_attribute('href', source['url'])
    else:
        expect(article.get_by_role('link', name='HKU MUSE')).to_have_count(0)

    photos = article.locator('img')
    expected_sources = [post['cover'], *(photo['src'] for photo in post['gallery'])]
    expected_alts = [content['coverAlt'], *(photo['alt'] for photo in content['gallery'])]
    expected_captions = [content['coverCaption'], *(photo['caption'] for photo in content['gallery'])]
    expect(photos).to_have_count(len(expected_sources))
    expect(article.locator('figcaption')).to_have_text(expected_captions)
    assert photos.evaluate_all('(images) => images.map(image => image.getAttribute("src"))') == expected_sources
    for index, photo in enumerate(photos.all()):
        expect(photo).to_have_attribute('alt', expected_alts[index])
        photo.scroll_into_view_if_needed()
        page.wait_for_function('(img) => img.complete && img.naturalWidth > 0', arg=photo.element_handle())
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), (post['slug'], code, width)
    if post['slug'] == 'between-tides-and-twilight':
        assert expected_sources == TRAVEL_PHOTOS
        assert post['publishedAt'] == '2026-10-11'


def check_switching(page, post: dict, code: str, index: int) -> None:
    article_selector = page.locator('.blog-language .language-select')
    article_selector.click()
    expect(page.locator('.blog-language [role="option"]')).to_have_count(8)
    next_code = LOCALES[(index + 1) % len(LOCALES)]
    page.locator(f'.blog-language [role="option"][data-value="{next_code}"]').click()
    expect(page.get_by_role('heading', level=1)).to_have_text(post['content'][next_code]['title'])
    expect(page.locator('.site-header .language-select')).to_have_attribute('data-value', next_code)
    assert page.url.endswith(f'#/blog/{post["slug"]}')
    page.reload(wait_until='networkidle')
    expect(page.get_by_role('heading', level=1)).to_have_text(post['content'][next_code]['title'])
    # The site selector drives the same article state in the other direction.
    page.locator('.site-header .language-select').click()
    page.locator(f'.site-header [role="option"][data-value="{code}"]').click()
    expect(article_selector).to_have_attribute('data-value', code)
    expect(page.get_by_role('heading', level=1)).to_have_text(post['content'][code]['title'])
    article_selector.click()
    page.keyboard.press('Escape')
    expect(article_selector).to_be_focused()
    expect(article_selector).to_have_attribute('aria-expanded', 'false')
    page.locator('.theme-toggle').click()
    expect(page.locator('html')).to_have_attribute('data-theme', 'dark')
    page.locator('.theme-toggle').click()


def check_listing(page, base_url: str, posts: dict) -> None:
    newest = max(posts.values(), key=lambda post: post['publishedAt'])
    order = sorted(posts.values(), key=lambda post: post['publishedAt'], reverse=True)
    for code in LOCALES:
        page.goto(f'{base_url}/?lang={code}#/blog', wait_until='networkidle')
        expect(page.locator('.blog-list .blog-card h2')).to_have_text([post['content'][code]['title'] for post in order])
        expect(page.locator('.blog-list .blog-card__excerpt')).to_have_text([post['content'][code]['excerpt'] for post in order])
        page.goto(f'{base_url}/?lang={code}#/', wait_until='networkidle')
        expect(page.locator('.home-blog .blog-card h2')).to_have_text(newest['content'][code]['title'])
        expect(page.locator('.home-blog .blog-card__image img')).to_have_attribute('src', newest['cover'])
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1'), ('home', code)


def run(base_url: str, output: Path, widths: tuple[int, ...], slugs: tuple[str, ...]) -> None:
    output.mkdir(parents=True, exist_ok=True)
    posts = load_posts()
    unknown = set(slugs) - set(posts)
    assert not unknown, f'Unknown article slugs: {sorted(unknown)}'
    checks, errors = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        for width in widths:
            context = browser.new_context(viewport={'width': width, 'height': 1000})
            page = context.new_page()
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
            for slug in slugs:
                post = posts[slug]
                for index, code in enumerate(LOCALES):
                    page.goto(f'{base_url}/?lang={code}#/blog/{slug}', wait_until='networkidle')
                    check_article(page, post, code, width)
                    page.evaluate('document.fonts.ready')
                    page.evaluate('window.scrollTo(0, 0)')
                    if width in (390, 1440) and code in ('en', 'zh', 'de', 'ru', 'uk'):
                        page.screenshot(path=str(output / f'{slug}-{code}-{width}.png'), full_page=True, animations='disabled')
                    check_switching(page, post, code, index)
                    checks.append({'slug': slug, 'locale': code, 'width': width, 'photographs': len(post['gallery']) + 1, 'prose': 'translated', 'selectors_refresh': 'ok'})

            # An ordinary shared link remains English even after the prior locale.
            page.goto(f'{base_url}/#/blog/{slugs[0]}', wait_until='networkidle')
            expect(page.get_by_role('heading', level=1)).to_have_text(posts[slugs[0]]['content']['en']['title'])
            expect(page.locator('article.blog-article')).to_have_attribute('lang', 'en')
            check_listing(page, base_url, posts)
            response = context.request.get(f'{base_url}/Hanyu_Yang_CV_Public.pdf')
            assert response.status == 200
            assert hashlib.sha256(response.body()).digest() == hashlib.sha256((ROOT / 'public/Hanyu_Yang_CV_Public.pdf').read_bytes()).digest(), 'Published CV differs from verified local PDF'
            context.close()
        browser.close()
    assert not errors, errors
    result = {'article_checks': len(checks), 'slugs': list(slugs), 'languages': list(LOCALES), 'listing_and_latest': 'all languages', 'errors': errors, 'public_cv': 'matches verified PDF', 'checks': checks}
    (output / 'results.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(json.dumps({key: value for key, value in result.items() if key != 'checks'}))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', default='http://127.0.0.1:4173')
    parser.add_argument('--output', type=Path, default=Path('artifacts/blog-qa'))
    parser.add_argument('--widths', nargs='+', type=int, default=[320, 390, 768, 1440])
    parser.add_argument('--slugs', nargs='+', default=list(DEFAULT_SLUGS))
    args = parser.parse_args()
    run(args.url.rstrip('/'), args.output, tuple(args.widths), tuple(args.slugs))
