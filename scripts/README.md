# Browser QA

The production quality gate is `npm run check`. Run the browser pass after building:

```bash
python -m pip install -r requirements-qa.txt
python -m playwright install chromium
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

In a second terminal:

```bash
python scripts/multilingual_qa.py
```

`multilingual_qa.py` checks all six routes in eight languages at 320, 390, 768,
and 1440px, validates Inter font loading, theme and language persistence,
navigation and Escape behavior, page overflow, browser errors, and the public PDF.
Screenshots and JSON results are saved to ignored `artifacts/multilingual-qa/`.
Pass `--url https://computersciencefreshmen.github.io` to check the live deployment.
`visual_qa.py` is the older bilingual interaction check; component tests cover its
project search and filter scenarios with the new language selector.

`capture_review.py`, `debug_reveal.py`, and `cv_visual_qa.py` are historical single-page
review helpers; use `visual_qa.py` for the current navigation and layout.

`generate_public_cv.py` and `verify_public_cv.py` manage the public PDF separately
from the website layout.
