"""Compatibility verifier for one public CV, backed by the localized checks."""

import argparse
import json
from pathlib import Path

from generate_multilingual_cv import ROOT
from verify_multilingual_cv import verify

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--locale", default="en")
    parser.add_argument("--render-dir", required=True, type=Path)
    parser.add_argument("--data-dir", type=Path, default=ROOT / "artifacts/public-cv-data")
    args = parser.parse_args()
    data = json.loads((args.data_dir / f"{args.locale}.json").read_text(encoding="utf-8"))
    print(json.dumps(verify(args.locale, data, args.pdf.resolve(), args.render_dir.resolve())))
