"""Validate public-CV content, privacy boundaries, and rendered pages."""

from __future__ import annotations

import argparse
from pathlib import Path
import re

import pdfplumber
from pypdf import PdfReader

REQUIRED_PHRASES = [
    "HANYU YANG",
    "CRM Data Analyst Intern",
    "HSBC",
    "The University of Hong Kong",
    "Bachelor of Science in Software Engineering",
    "Research Experience",
    "Selected Engineering Projects",
    "Awards & Recognition",
    "Publication",
]

PRIVATE_PATTERNS = {
    "email address": re.compile(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", re.I),
    "Chinese mobile number": re.compile(r"(?<!\d)1[3-9]\d{9}(?!\d)"),
}


def verify(pdf_path: Path, render_dir: Path) -> list[Path]:
    reader = PdfReader(str(pdf_path))
    if not 2 <= len(reader.pages) <= 4:
        raise AssertionError(f"Expected 2-4 pages, found {len(reader.pages)}")

    text = "\n".join(page.extract_text() or "" for page in reader.pages)
    metadata_text = "\n".join(
        str(value) for value in (reader.metadata or {}).values()
    )
    searchable = f"{text}\n{metadata_text}"

    missing = [phrase for phrase in REQUIRED_PHRASES if phrase not in text]
    if missing:
        raise AssertionError(f"Missing required CV content: {missing}")

    leaked = [
        label for label, pattern in PRIVATE_PATTERNS.items() if pattern.search(searchable)
    ]
    if leaked:

        raise AssertionError(f"Private contact content found: {leaked}")
    render_dir.mkdir(parents=True, exist_ok=True)
    rendered: list[Path] = []
    with pdfplumber.open(str(pdf_path)) as document:
        if len(document.pages) != len(reader.pages):
            raise AssertionError("PDF readers disagree on page count")

        for index, page in enumerate(document.pages, start=1):
            if not page.extract_text():
                raise AssertionError(f"Page {index} has no extractable text")

            image = page.to_image(resolution=150, antialias=True)
            output = render_dir / f"public-cv-page-{index}.png"
            image.save(str(output), format="PNG")
            rendered.append(output)

    return rendered


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("pdf", type=Path)
    parser.add_argument("--render-dir", required=True, type=Path)
    args = parser.parse_args()

    rendered = verify(args.pdf.resolve(), args.render_dir.resolve())
    print(f"Verified {args.pdf.resolve()}")
    print(f"Pages: {len(rendered)}")
    for page in rendered:
        print(page)


if __name__ == "__main__":
    main()
