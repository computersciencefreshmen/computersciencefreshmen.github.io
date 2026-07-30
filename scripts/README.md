# Optional browser QA

The production quality gate is `npm run check`. These Python scripts provide an
additional local visual and interaction pass.

```bash
python -m pip install -r requirements-qa.txt
python -m playwright install chromium
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

In a second terminal:

```bash
python scripts/visual_qa.py
```

- `visual_qa.py` checks HTTP status, project count, external links, the local portrait,
  mobile navigation, English/Chinese switching, horizontal overflow, and browser errors.
- `capture_review.py` creates section screenshots in `artifacts/qa/`.
- `debug_reveal.py` verifies that every scroll-reveal element becomes visible through
  real viewport movement.

`artifacts/` is intentionally ignored by Git.
