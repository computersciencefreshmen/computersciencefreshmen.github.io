# Chinese font subsets

These are modified, self-hosted subsets of **Noto Sans SC Variable**, derived from
`@fontsource-variable/noto-sans-sc` 5.3.0. The original SIL Open Font License is
included in `OFL.txt`. Variable weights 100–900 are preserved.

The generator reads non-ASCII characters from `src/**/*.ts`, `src/**/*.tsx`,
`index.html`, and `public/site.webmanifest`. Each original Unicode shard is reduced
to characters in those sources. It verifies that every source character supported
by the upstream font remains supported by the generated files. The generated CSS
lists exact Unicode ranges, so browsers load only shards needed by the page.

After adding or changing Chinese text, run from the repository root:

```sh
npm ci
python -m pip install -r requirements-fonts.txt
python scripts/subset_fonts.py
npm run build
```

Commit the generated `.woff2` files and `subset.css` alongside the text update.
Regular development and CI builds use these committed assets and do not need
Python. New characters not yet regenerated fall through to the CSS generic
`sans-serif` fallback instead of displaying a missing glyph. Regeneration restores
the consistent Noto appearance. European-language text uses full Inter subsets and
does not require regeneration.
