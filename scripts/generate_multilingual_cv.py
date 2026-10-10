"""Generate eight public CVs from the website's localized source records.

Fonts are embedded as subsets so Chinese and Cyrillic CVs remain readable
on other computers. Use --font-* options on systems without Windows fonts.
"""

from __future__ import annotations

import argparse
import json
import os
from html import escape
from pathlib import Path
import subprocess

from pypdf import PdfReader, PdfWriter
from pypdf.generic import NameObject, TextStringObject
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import HRFlowable, KeepTogether, Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
LOCALES = ("en", "zh", "de", "fr", "it", "ru", "es", "uk")
INK = colors.HexColor("#10211B")
SOFT = colors.HexColor("#34483E")
MUTED = colors.HexColor("#64766B")
PAPER = colors.HexColor("#F5F4EE")
RULE = colors.HexColor("#D8DFD9")
BLUE = colors.HexColor("#537F86")
RED = colors.HexColor("#DB0011")
PAGE_WIDTH, PAGE_HEIGHT = A4
MARGIN = 17 * mm
WIDTH = PAGE_WIDTH - 2 * MARGIN


def plain(text: str) -> str:
    for dash in ("\u2010", "\u2011", "\u2012", "\u2013", "\u2014", "\u2212"):
        text = text.replace(dash, "-")
    return text


def find_font(override: Path | None, candidates: list[Path]) -> Path:
    if override:
        if not override.is_file():
            raise FileNotFoundError(override)
        return override
    for candidate in candidates:
        if candidate.is_file():
            return candidate
    raise FileNotFoundError("No suitable font found; provide the explicit font CLI options.")


def register_fonts(args: argparse.Namespace) -> dict[str, tuple[str, str, str]]:
    windows = Path(os.environ.get("WINDIR", "C:/Windows")) / "Fonts"
    liberation = Path("/usr/share/fonts/truetype/liberation2")
    regular = find_font(args.font_regular, [windows / "arial.ttf", liberation / "LiberationSans-Regular.ttf"])
    bold = find_font(args.font_bold, [windows / "arialbd.ttf", liberation / "LiberationSans-Bold.ttf"])
    italic = find_font(args.font_italic, [windows / "ariali.ttf", liberation / "LiberationSans-Italic.ttf"])
    for name, path in (("CVRegular", regular), ("CVBold", bold), ("CVItalic", italic)):
        pdfmetrics.registerFont(TTFont(name, str(path), subfontIndex=0))
    pdfmetrics.registerFontFamily("CVRegular", normal="CVRegular", bold="CVBold", italic="CVItalic", boldItalic="CVBold")
    families = {code: ("CVRegular", "CVBold", "CVItalic") for code in LOCALES}
    if args.locale in ("all", "zh"):
        cjk = find_font(args.font_cjk, [windows / "msyh.ttc", windows / "simhei.ttf"])
        cjk_bold = find_font(args.font_cjk_bold, [windows / "msyhbd.ttc", cjk])
        pdfmetrics.registerFont(TTFont("CVChinese", str(cjk), subfontIndex=0))
        pdfmetrics.registerFont(TTFont("CVChineseBold", str(cjk_bold), subfontIndex=0))
        pdfmetrics.registerFontFamily("CVChinese", normal="CVChinese", bold="CVChineseBold", italic="CVChinese", boldItalic="CVChineseBold")
        families["zh"] = ("CVChinese", "CVChineseBold", "CVChinese")
    return families


def styles_for(data: dict, family: tuple[str, str, str]) -> dict[str, ParagraphStyle]:
    regular, bold, italic = family
    compact_layout = data["locale"] == "ru"
    base = dict(fontName=regular, textColor=SOFT, wordWrap="CJK" if data["locale"] == "zh" else None)
    settings = {
        "name": dict(fontName=bold, fontSize=29, leading=34, textColor=INK, spaceAfter=5),
        "tagline": dict(fontSize=8.5, leading=12),
        "links": dict(fontSize=7.2, leading=10, alignment=TA_RIGHT),
        "index": dict(fontName=bold, fontSize=6.8, leading=9, textColor=BLUE, spaceBefore=5 if compact_layout else 7, spaceAfter=2, keepWithNext=True),
        "section": dict(fontName=bold, fontSize=11.5, leading=15, textColor=INK, spaceAfter=5, keepWithNext=True),
        "summary": dict(fontSize=8.7, leading=12.8),
        "title": dict(fontName=bold, fontSize=9.2, leading=12, textColor=INK, spaceAfter=3),
        "organization": dict(fontName=bold, fontSize=8.2, leading=11),
        "date": dict(fontName=bold, fontSize=7.6, leading=10, alignment=TA_RIGHT, textColor=INK),
        "location": dict(fontSize=7.4, leading=10, alignment=TA_RIGHT, textColor=MUTED),
        "bullet": dict(fontSize=8.1, leading=10.8 if compact_layout else 11.2, leftIndent=9, firstLineIndent=-7, spaceBefore=1 if compact_layout else 2),
        "small": dict(fontSize=7.5, leading=10.3 if compact_layout else 10.8),
        "label": dict(fontName=bold, fontSize=7.4, leading=10.5, textColor=BLUE, spaceAfter=4),
        "citation": dict(fontName=italic, fontSize=8.1, leading=11.8),
    }
    return {key: ParagraphStyle(key, **(base | value)) for key, value in settings.items()}


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(escape(plain(text)), style)


def section(index: int, key: str, data: dict, styles: dict) -> list:
    rule = HRFlowable(width="100%", thickness=0.6, color=INK, spaceAfter=7)
    rule.keepWithNext = True
    return [paragraph(f"{index:02d} / {data['labels'][key]}", styles["index"]), paragraph(data["labels"][key], styles["section"]), rule]


def entry_card(entry: dict, data: dict, styles: dict) -> list:
    # Russian prose needs more lines. Reduce spacing rather than font size,
    # preserving readable text while avoiding a mostly empty fourth page.
    padding = 4 if data["locale"] == "ru" else 6
    inner_width = WIDTH - 18
    metadata = Table([
        [paragraph(entry["organization"], styles["organization"]), paragraph(entry["period"], styles["date"])],
        [paragraph(entry["title"], styles["title"]), paragraph(entry["location"], styles["location"])],
    ], colWidths=[inner_width * 0.73, inner_width * 0.27])
    metadata.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, -1), 10), ("RIGHTPADDING", (1, 0), (1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
    ]))
    content = [metadata]
    content.extend(paragraph(f"- {text}", styles["bullet"]) for text in entry["bullets"])
    if entry["technologies"]:
        content.extend([Spacer(1, 4), paragraph(f"{data['labels']['tools']}: {' / '.join(entry['technologies'])}", styles["small"])])
    card = Table([[content]], colWidths=[WIDTH])
    card.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PAPER), ("BOX", (0, 0), (-1, -1), 0.5, RULE),
        ("LINEBEFORE", (0, 0), (0, 0), 2.5, RED if entry["id"] == "hsbc-crm-data-analyst" else BLUE),
        ("LEFTPADDING", (0, 0), (-1, -1), 9), ("RIGHTPADDING", (0, 0), (-1, -1), 9),
        ("TOPPADDING", (0, 0), (-1, -1), padding), ("BOTTOMPADDING", (0, 0), (-1, -1), padding),
    ]))
    return [card, Spacer(1, 3 if data["locale"] == "ru" else 4)]


def build_story(data: dict, styles: dict) -> list:
    links = "<br/>".join(f'<link href="{escape(item["url"])}">{escape(item["label"])}</link>' for item in data["links"])
    header = Table([[[paragraph(data["name"].upper(), styles["name"]), paragraph(data["tagline"], styles["tagline"])], Paragraph(links, styles["links"])]], colWidths=[WIDTH * 0.67, WIDTH * 0.33])
    header.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "BOTTOM"), ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (0, 0), 12), ("RIGHTPADDING", (1, 0), (1, 0), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
    ]))
    story = [header, Spacer(1, 9), HRFlowable(width="100%", thickness=1, color=INK, spaceAfter=7), paragraph(data["labels"]["profile"], styles["index"]), paragraph(data["profile"], styles["summary"]), Spacer(1, 4)]
    for index, key in enumerate(("experience", "education", "research", "projects"), start=1):
        cards = [entry_card(entry, data, styles) for entry in data[key]]
        # A heading belongs to its first card; independent KeepTogether cards
        # otherwise interrupt ReportLab's keepWithNext chain at a page boundary.
        story.append(KeepTogether([*section(index, key, data, styles), *cards[0]]))
        story.extend(KeepTogether(card) for card in cards[1:])
    skill_cells = [[paragraph(group["label"], styles["label"]), paragraph(" / ".join(group["values"]), styles["small"])] for group in data["skills"]]
    skill_table = Table([skill_cells], colWidths=[WIDTH * 0.32, WIDTH * 0.42, WIDTH * 0.26])
    skill_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PAPER), ("BOX", (0, 0), (-1, -1), 0.5, RULE),
        ("INNERGRID", (0, 0), (-1, -1), 0.35, RULE), ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 8), ("RIGHTPADDING", (0, 0), (-1, -1), 8),
        ("TOPPADDING", (0, 0), (-1, -1), 8), ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.extend([KeepTogether([*section(5, "skills", data, styles), skill_table]), Spacer(1, 5)])
    for index, award in enumerate(data["awards"], start=1):
        row = Table([[paragraph(f"{index:02d}", styles["label"]), paragraph(award, styles["small"])]], colWidths=[11 * mm, WIDTH - 11 * mm])
        row.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"), ("LINEBELOW", (0, 0), (-1, -1), 0.35, RULE),
            ("LEFTPADDING", (0, 0), (-1, -1), 0), ("RIGHTPADDING", (0, 0), (-1, -1), 0),
            ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        story.append(KeepTogether([*section(6, "awards", data, styles), row]) if index == 1 else row)
    story.append(KeepTogether([*section(7, "publication", data, styles), paragraph(data["publication"], styles["citation"]), Spacer(1, 12), HRFlowable(width="100%", thickness=0.6, color=INK, spaceAfter=6), paragraph(f"{data['labels']['publicSharingNote']}. {data['sharingNote']}", styles["small"])]))
    return story


def draw_page(data: dict, family: tuple[str, str, str]):
    def draw(canvas, doc) -> None:
        canvas.saveState()
        canvas.setFillColor(INK)
        canvas.rect(0, PAGE_HEIGHT - 4 * mm, PAGE_WIDTH, 4 * mm, stroke=0, fill=1)
        canvas.setStrokeColor(RULE)
        canvas.setLineWidth(0.4)
        canvas.line(MARGIN, 11 * mm, PAGE_WIDTH - MARGIN, 11 * mm)
        canvas.setFont(family[0], 6.4)
        canvas.setFillColor(MUTED)
        canvas.drawString(MARGIN, 7 * mm, plain(f"{data['name'].upper()} / {data['labels']['publicCv']} / {data['footerMonth']}"))
        canvas.setFont(family[1], 7)
        canvas.drawRightString(PAGE_WIDTH - MARGIN, 7 * mm, f"{doc.page:02d}")
        canvas.restoreState()
    return draw


def check_glyphs(data: dict, family: tuple[str, str, str]) -> None:
    strings: list[str] = []
    def collect(value):
        if isinstance(value, str):
            strings.append(plain(value))
        elif isinstance(value, list):
            for item in value:
                collect(item)
        elif isinstance(value, dict):
            for item in value.values():
                collect(item)
    collect(data)
    for font_name in family[:2]:
        glyphs = pdfmetrics.getFont(font_name).face.charToGlyph
        missing = sorted({char for text in strings for char in text if not char.isspace() and ord(char) not in glyphs})
        if missing:
            raise ValueError(f"{data['locale']}: {font_name} has no glyph for {missing}")


def generate(data: dict, output: Path, family: tuple[str, str, str]) -> None:
    check_glyphs(data, family)
    output.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(str(output), pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=17 * mm, bottomMargin=17 * mm, title=f"{data['name']} - {data['labels']['publicCv']}", author="Hanyu Yang", subject=data["tagline"])
    draw = draw_page(data, family)
    document.build(build_story(data, styles_for(data, family)), onFirstPage=draw, onLaterPages=draw)
    reader = PdfReader(output)
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    writer._root_object[NameObject("/Lang")] = TextStringObject(data["tag"])
    with output.open("wb") as stream:
        writer.write(stream)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--locale", choices=("all", *LOCALES), default="all")
    parser.add_argument("--data-dir", type=Path, default=ROOT / "artifacts/public-cv-data")
    parser.add_argument("--skip-export", action="store_true", help="Use a previously exported dataset.")
    parser.add_argument("--output", type=Path, help="Override output for a single locale.")
    for name in ("regular", "bold", "italic", "cjk", "cjk-bold"):
        parser.add_argument(f"--font-{name}", type=Path)
    args = parser.parse_args()
    if args.output and args.locale == "all":
        parser.error("--output requires a single --locale")
    if not args.skip_export:
        subprocess.run(["node", str(ROOT / "scripts/export_public_cv.mjs"), "--output", str(args.data_dir)], check=True)
    families = register_fonts(args)
    for code in LOCALES if args.locale == "all" else (args.locale,):
        data = json.loads((args.data_dir / f"{code}.json").read_text(encoding="utf-8"))
        output = args.output or (ROOT / "public/Hanyu_Yang_CV_Public.pdf" if code == "en" else ROOT / f"public/cv/Hanyu_Yang_CV_Public_{code}.pdf")
        generate(data, output, families[code])
        print(f"Generated {code}: {output} ({len(PdfReader(output).pages)} pages)")


if __name__ == "__main__":
    main()
