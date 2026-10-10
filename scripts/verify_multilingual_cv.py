"""Verify all localized PDF prose, metrics, fonts, links and page boundaries."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re

import pdfplumber
from pypdf import PdfReader

from generate_multilingual_cv import LOCALES, MARGIN, ROOT, plain


def compact(text: str) -> str:
    return re.sub(r"\s+", "", plain(text))


def expected_text(data: dict) -> list[str]:
    phrases = [data["name"].upper(), data["profile"], data["tagline"], data["publication"], data["sharingNote"], data["footerMonth"]]
    phrases.extend(data["labels"].values())
    for group in ("experience", "education", "research", "projects"):
        for entry in data[group]:
            phrases.extend(entry[key] for key in ("title", "organization", "period", "location"))
            phrases.extend(entry["bullets"])
            phrases.extend(entry["technologies"])
    for group in data["skills"]:
        phrases.append(group["label"])
        phrases.extend(group["values"])
    phrases.extend(data["awards"])
    return phrases


def verify_section_ownership(code: str, data: dict, page_texts: list[str]) -> None:
    """A heading must introduce its first item on the same physical page.

    Text completeness alone cannot catch an orphaned heading at the bottom of
    the previous page. Use the numbered index to distinguish a section heading
    from a repeated word in a role, tool list, or footer.
    """
    first_items = {
        key: data[key][0]["title"]
        for key in ("experience", "education", "research", "projects")
    } | {
        "skills": data["skills"][0]["label"],
        "awards": data["awards"][0],
        "publication": data["publication"],
    }
    searchable_pages = [compact(text) for text in page_texts]
    for index, (key, first_item) in enumerate(first_items.items(), start=1):
        index_text = compact(f"{index:02d} / {data['labels'][key]}")
        pages = [page_index for page_index, text in enumerate(searchable_pages) if index_text in text]
        if len(pages) != 1:
            raise AssertionError(f"{code}: section {key} index occurs on {len(pages)} pages")
        if compact(first_item) not in searchable_pages[pages[0]]:
            raise AssertionError(f"{code}: orphaned {key} heading on page {pages[0] + 1}")


def verify(code: str, data: dict, pdf_path: Path, output_dir: Path) -> dict:
    reader = PdfReader(pdf_path)
    if not 2 <= len(reader.pages) <= 5:
        raise AssertionError(f"{code}: unexpected page count {len(reader.pages)}")
    if reader.trailer["/Root"].get("/Lang") != data["tag"]:
        raise AssertionError(f"{code}: PDF language tag differs from website")
    page_texts = [page.extract_text() or "" for page in reader.pages]
    text = "\n".join(page_texts)
    searchable = compact(text)
    missing = [phrase for phrase in expected_text(data) if compact(phrase) not in searchable]
    if missing:
        raise AssertionError(f"{code}: untranslated, truncated or missing PDF prose: {missing}")
    verify_section_ownership(code, data, page_texts)
    metadata = " ".join(str(value) for value in (reader.metadata or {}).values())
    for label, pattern in {
        "private email": r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b",
        "private Chinese mobile": r"(?<!\d)1[3-9]\d{9}(?!\d)",
        "replacement glyph": "\ufffd",
    }.items():
        if re.search(pattern, text + metadata, re.I):
            raise AssertionError(f"{code}: found {label}")
    if re.search(r"Top\s*20%|incoming postgraduate", text, re.I):
        raise AssertionError(f"{code}: superseded education details")
    links = {annotation.get_object().get("/A", {}).get("/URI") for page in reader.pages for annotation in page.get("/Annots", [])}
    if not {link["url"] for link in data["links"]}.issubset(links):
        raise AssertionError(f"{code}: missing public professional hyperlinks")
    embedded = set()
    for page in reader.pages:
        for font_ref in page["/Resources"].get("/Font", {}).values():
            font = font_ref.get_object()
            descriptor = font.get("/FontDescriptor")
            if descriptor and descriptor.get_object().get("/FontFile2"):
                embedded.add(str(font["/BaseFont"]).split("+")[-1])
    if len(embedded) < 2:
        raise AssertionError(f"{code}: regular/bold fonts are not embedded")
    output_dir.mkdir(parents=True, exist_ok=True)
    # A regenerated edition may shrink from four pages to three. Remove only
    # our own obsolete render filenames, after verifying their resolved parent.
    for old_render in output_dir.glob("page-*.png"):
        match = re.fullmatch(r"page-(\d+)\.png", old_render.name)
        if match and int(match[1]) > len(reader.pages) and old_render.is_file():
            if old_render.resolve().parent != output_dir.resolve():
                raise AssertionError(f"Refusing to remove render outside {output_dir}")
            old_render.unlink()
    final_body_span = 0.0
    with pdfplumber.open(pdf_path) as document:
        for index, page in enumerate(document.pages, start=1):
            if not page.extract_text():
                raise AssertionError(f"{code}: blank page {index}")
            outside = [char for char in page.chars if char["text"].strip() and (char["x0"] < MARGIN - 2 or char["x1"] > page.width - MARGIN + 2 or char["top"] < 12 or char["bottom"] > page.height - 8)]
            if outside:
                raise AssertionError(f"{code}: text outside intended printable area on page {index}: {outside[:2]}")
            if index == len(document.pages):
                body_chars = [char for char in page.chars if char["text"].strip()
                    and char["top"] >= MARGIN - 2 and char["bottom"] <= page.height - MARGIN + 2]
                if not body_chars:
                    raise AssertionError(f"{code}: final page contains no body text")
                final_body_span = max(char["bottom"] for char in body_chars) - min(char["top"] for char in body_chars)
                # A citation/note spilling alone onto another page is not a
                # useful CV page. A quarter-page minimum still permits a short,
                # naturally flowing final page without enforcing identical length.
                if final_body_span < 180:
                    raise AssertionError(f"{code}: sparse final page {index} (body span {final_body_span:.1f}pt)")
            page.to_image(resolution=110, antialias=True).save(output_dir / f"page-{index}.png", format="PNG")
    return {"locale": code, "pages": len(reader.pages), "verified_phrases": len(expected_text(data)), "embedded_fonts": sorted(embedded), "size_bytes": pdf_path.stat().st_size, "final_page_body_span_pt": round(final_body_span, 1)}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path, default=ROOT / "artifacts/public-cv-data")
    parser.add_argument("--public-dir", type=Path, default=ROOT / "public")
    parser.add_argument("--render-dir", type=Path, default=ROOT / "artifacts/multilingual-cv-render")
    args = parser.parse_args()
    results = []
    for code in LOCALES:
        data = json.loads((args.data_dir / f"{code}.json").read_text(encoding="utf-8"))
        pdf = args.public_dir / ("Hanyu_Yang_CV_Public.pdf" if code == "en" else f"cv/Hanyu_Yang_CV_Public_{code}.pdf")
        result = verify(code, data, pdf, args.render_dir / code)
        results.append(result)
        print(json.dumps(result, ensure_ascii=True))
    (args.render_dir / "results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8")
    print("Verified all 8 localized public CVs")


if __name__ == "__main__":
    main()
