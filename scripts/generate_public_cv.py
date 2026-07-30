"""Generate the privacy-safe public CV distributed by the portfolio site."""

from __future__ import annotations

import argparse
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    HRFlowable,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

INK = colors.HexColor("#0A1512")
INK_SOFT = colors.HexColor("#31433C")
MUTED = colors.HexColor("#68776F")
PAPER = colors.HexColor("#F4F1E8")
SIGNAL = colors.HexColor("#B5FF7D")
HSBC_RED = colors.HexColor("#DB0011")
BLUE = colors.HexColor("#5D8FCC")
RULE = colors.HexColor("#D8D7D0")

PAGE_WIDTH, PAGE_HEIGHT = A4
LEFT = 17 * mm
RIGHT = 17 * mm
TOP = 17 * mm
BOTTOM = 15 * mm

styles = getSampleStyleSheet()

NAME = ParagraphStyle(
    "Name",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=30,
    leading=31,
    textColor=INK,
    spaceAfter=4,
)
TAGLINE = ParagraphStyle(
    "Tagline",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9.2,
    leading=12,
    textColor=INK_SOFT,
)
LINKS = ParagraphStyle(
    "Links",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=7.6,
    leading=10,
    textColor=INK_SOFT,
    alignment=TA_RIGHT,
)
SECTION = ParagraphStyle(
    "Section",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=11,
    leading=13,
    textColor=INK,
    spaceBefore=8,
    spaceAfter=5,
    keepWithNext=True,
)
SECTION_INDEX = ParagraphStyle(
    "SectionIndex",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=6.5,
    leading=8,
    textColor=BLUE,
    tracking=1.1,
    spaceBefore=8,
    spaceAfter=1,
    keepWithNext=True,
)
SUMMARY = ParagraphStyle(
    "Summary",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.2,
    leading=12,
    textColor=INK_SOFT,
)
ROLE = ParagraphStyle(
    "Role",
    parent=styles["Heading3"],
    fontName="Helvetica-Bold",
    fontSize=9.1,
    leading=11.2,
    textColor=INK,
    spaceAfter=2,
)
ORG = ParagraphStyle(
    "Org",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=7.7,
    leading=9.4,
    textColor=INK_SOFT,
)
DATE = ParagraphStyle(
    "Date",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=7.2,
    leading=9,
    textColor=INK,
)
LOCATION = ParagraphStyle(
    "Location",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=6.8,
    leading=8.5,
    textColor=MUTED,
)
BULLET = ParagraphStyle(
    "Bullet",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=7.45,
    leading=10.1,
    leftIndent=10,
    firstLineIndent=-7,
    textColor=INK_SOFT,
    spaceBefore=1.5,
)
SMALL = ParagraphStyle(
    "Small",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=6.9,
    leading=9.2,
    textColor=INK_SOFT,
)
LABEL = ParagraphStyle(
    "Label",
    parent=styles["BodyText"],
    fontName="Helvetica-Bold",
    fontSize=6.6,
    leading=8,
    textColor=BLUE,
)
CITATION = ParagraphStyle(
    "Citation",
    parent=styles["BodyText"],
    fontName="Helvetica-Oblique",
    fontSize=7.2,
    leading=10.2,
    textColor=INK_SOFT,
)


def link(text: str, url: str) -> str:
    return f'<link href="{escape(url)}" color="#31433C">{escape(text)}</link>'


def bullet(text: str) -> Paragraph:
    return Paragraph(f"- {escape(text)}", BULLET)


def section_heading(index: str, title: str) -> list:
    return [
        Paragraph(index.upper(), SECTION_INDEX),
        Paragraph(title, SECTION),
        HRFlowable(width="100%", thickness=0.6, color=INK, spaceAfter=5),
    ]


def role_block(
    *,
    organization: str,
    role: str,
    period: str,
    location: str,
    bullets: list[str],
    tags: str | None = None,
    accent: colors.Color = BLUE,
) -> KeepTogether:
    metadata = Table(
        [
            [
                Paragraph(escape(organization), ORG),
                Paragraph(escape(period), DATE),
            ],
            [
                Paragraph(escape(role), ROLE),
                Paragraph(escape(location), LOCATION),
            ],
        ],
        colWidths=[128 * mm, 36 * mm],
    )
    metadata.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        )
    )
    content: list = [metadata]
    content.extend(bullet(item) for item in bullets)
    if tags:
        content.append(Spacer(1, 2))
        content.append(
            Paragraph(f"<b>TOOLS</b>  {escape(tags)}", SMALL)
        )

    card = Table([[content]], colWidths=[164 * mm])
    card.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PAPER),
                ("BOX", (0, 0), (-1, -1), 0.55, RULE),
                ("LINEBEFORE", (0, 0), (0, 0), 3, accent),
                ("LEFTPADDING", (0, 0), (-1, -1), 9),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return KeepTogether([card, Spacer(1, 5)])


def compact_entry(
    *,
    title: str,
    subtitle: str,
    period: str,
    body: str,
) -> KeepTogether:
    heading = Table(
        [
            [
                Paragraph(escape(title), ROLE),
                Paragraph(escape(period), DATE),
            ],
            [
                Paragraph(escape(subtitle), ORG),
                Paragraph("", LOCATION),
            ],
        ],
        colWidths=[132 * mm, 32 * mm],
    )
    heading.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 1),
            ]
        )
    )
    return KeepTogether(
        [
            heading,
            Paragraph(escape(body), SMALL),
            Spacer(1, 4),
            HRFlowable(width="100%", thickness=0.35, color=RULE, spaceAfter=4),
        ]
    )


def first_page_header() -> Table:
    links_markup = "<br/>".join(
        [
            link("computersciencefreshmen.github.io", "https://computersciencefreshmen.github.io/"),
            link("github.com/computersciencefreshmen", "https://github.com/computersciencefreshmen"),
            link("linkedin.com/in/henryyanghy", "https://www.linkedin.com/in/henryyanghy"),
        ]
    )
    header = Table(
        [
            [
                [
                    Paragraph("HANYU YANG", NAME),
                    Paragraph(
                        "CRM DATA ANALYTICS  /  SOFTWARE SYSTEMS  /  APPLIED AI",
                        TAGLINE,
                    ),
                ],
                Paragraph(links_markup, LINKS),
            ]
        ],
        colWidths=[111 * mm, 53 * mm],
    )
    header.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    return header


def draw_page(canvas, doc) -> None:
    canvas.saveState()
    canvas.setTitle("Hanyu Yang - Public CV")
    canvas.setAuthor("Hanyu Yang")
    canvas.setSubject("Public professional curriculum vitae")
    canvas.setKeywords("Hanyu Yang, data analytics, software engineering, AI")

    canvas.setFillColor(INK)
    canvas.rect(0, PAGE_HEIGHT - 4 * mm, PAGE_WIDTH, 4 * mm, stroke=0, fill=1)
    canvas.setFillColor(HSBC_RED)
    canvas.rect(LEFT, PAGE_HEIGHT - 4 * mm, 35 * mm, 4 * mm, stroke=0, fill=1)

    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.4)
    canvas.line(LEFT, 11 * mm, PAGE_WIDTH - RIGHT, 11 * mm)

    canvas.setFont("Helvetica", 6.4)
    canvas.setFillColor(MUTED)
    canvas.drawString(LEFT, 7 * mm, "HANYU YANG  /  PUBLIC CV  /  JULY 2026")
    page_label = f"{doc.page:02d}"
    label_width = stringWidth(page_label, "Helvetica-Bold", 7)
    canvas.setFont("Helvetica-Bold", 7)
    canvas.setFillColor(INK)
    canvas.drawString(PAGE_WIDTH - RIGHT - label_width, 7 * mm, page_label)
    canvas.restoreState()


def build_story() -> list:
    story: list = [
        first_page_header(),
        Spacer(1, 7),
        HRFlowable(width="100%", thickness=1.1, color=INK, spaceAfter=6),
        Paragraph("PROFILE", SECTION_INDEX),
        Paragraph(
            "Software engineering graduate and incoming postgraduate student in AI, "
            "Ethics and Society at the University of Hong Kong. Experience spans CRM "
            "data analytics in financial services, AI workflow development, full-stack "
            "products, multimodal research, and distributed data systems. I work best "
            "where technical evidence, business context, and clear delivery meet.",
            SUMMARY,
        ),
        Spacer(1, 4),
    ]

    story.extend(section_heading("01 / Experience", "Professional Experience"))
    story.append(
        role_block(
            organization="HSBC - Wealth and Personal Banking",
            role="CRM Data Analyst Intern",
            period="Mar. 2026 - Jul. 2026",
            location="Guangzhou, China",
            accent=HSBC_RED,
            bullets=[
                "Integrated core-banking, credit-card, and mobile-channel customer data with SQL and Python on GCP BigQuery and Data Science Workbench, supporting a unified customer view and precise WPB profiling.",
                "Performed data cleaning, exploratory analysis, and predictive modeling in Python to support customer segmentation and evidence-led marketing decisions.",
                "Contributed to precision-marketing strategy and campaign deployment through SmartCRM and PEGA, supporting omnichannel customer lifecycle management.",
                "Supported omnichannel customer-communications delivery by coordinating handover requirements, UAT inputs, execution readiness, channel schedules, and stakeholder sign-offs across in-app, eDM, and marketing-push journeys.",
            ],
            tags="SQL  /  Python  /  GCP BigQuery  /  Data Science Workbench  /  SmartCRM  /  PEGA  /  UAT",
        )
    )
    story.append(
        role_block(
            organization="Guangzhou Xin'an Data Co., Ltd.",
            role="AI Development Intern - Digital Innovation Department",
            period="Jul. 2025 - Aug. 2025",
            location="Guangzhou, China",
            bullets=[
                "Designed and deployed a full-stack AI prompt-optimization platform with authentication, community libraries, and knowledge-sharing capabilities for more than 100 internal users.",
                "Integrated Model Context Protocol with Dify to automate AI-driven reporting workflows.",
                "Developed RESTful APIs for third-party integration and enterprise data exchange.",
            ],
            tags="MCP  /  Dify  /  REST API  /  Full-stack systems  /  AI workflows",
        )
    )

    story.extend(section_heading("02 / Education", "Education"))
    story.append(
        compact_entry(
            title="Master of Arts in AI, Ethics and Society",
            subtitle="The University of Hong Kong - Hong Kong SAR",
            period="Sept. 2026 - Aug. 2027 (Expected)",
            body="Incoming postgraduate study connecting AI systems with their ethical and societal contexts.",
        )
    )
    story.append(
        compact_entry(
            title="Bachelor of Science in Software Engineering",
            subtitle="Guangdong University of Foreign Studies - School of Information Science and Technology",
            period="Sept. 2022 - Jun. 2026",
            body=(
                "GPA 88/100 - Top 20%. Selected modules: Text Information Processing (99), "
                "Network Programming (96), Natural Language Processing (96), Software "
                "Architecture (96), Big Data Processing Technology (94), Further "
                "Mathematics (91), and Web Design (90)."
            ),
        )
    )

    story.append(PageBreak())
    story.extend(section_heading("03 / Research", "Research Experience"))
    story.append(
        role_block(
            organization="Guangdong University of Foreign Studies",
            role="Research Contributor - Fake News Detection through Multimodal Attention",
            period="Oct. 2024 - Dec. 2024",
            location="Guangzhou, China",
            bullets=[
                "Proposed a semantic-conflict recognition and multimodal-attention framework for image-text inconsistency.",
                "Added KL-divergence and MSE modules to CLIP alignment for quantifying cross-modal semantic discrepancies.",
                "Combined BERT, ResNet-50, and cross-modal self-attention, reaching 88.9% accuracy and improving on the CLIP baseline by 2.8%.",
            ],
            tags="BERT  /  ResNet-50  /  CLIP  /  Multimodal attention",
        )
    )
    story.append(
        role_block(
            organization="University of Cambridge",
            role="Research Leader - Skin Cancer Classification with CNN and Attention",
            period="Aug. 2024",
            location="Cambridge, UK",
            bullets=[
                "Led development of a lightweight enhanced-AlexNet CNN for benign-versus-malignant dermoscopic lesion classification.",
                "Integrated spatial attention to focus the model on diagnostically relevant regions.",
                "Improved classification accuracy by 15% through preprocessing optimization and background-noise suppression.",
            ],
            tags="CNN  /  AlexNet  /  Spatial attention  /  Medical imaging",
        )
    )
    story.append(
        role_block(
            organization="Guangdong University of Foreign Studies",
            role="Algorithm Designer - Autonomous Parking Detection",
            period="Oct. 2023 - Nov. 2023",
            location="Guangzhou, China",
            bullets=[
                "Redesigned YOLOv5s with a GhostNet backbone and CBAM attention for parking-slot detection under occlusion and variable lighting.",
                "Trained in PyTorch with RMSProp and Mosaic augmentation for 500 epochs on RTX 3090.",
                "Reached 97.1% AP and 93.7% AR while reducing inference latency by 20% against the YOLOv5s baseline.",
            ],
            tags="PyTorch  /  YOLOv5s  /  GhostNet  /  CBAM",
        )
    )

    story.extend(section_heading("04 / Engineering", "Selected Engineering Projects"))
    story.append(
        compact_entry(
            title="International Chinese Education Platform - Front-End Developer",
            subtitle="Vue 3 / Composition API / Real-time UX",
            period="Apr. 2025 - Jul. 2025",
            body=(
                "Built a responsive student portal with real-time class management and "
                "messaging for more than 500 international students. Added lazy loading "
                "and virtual scrolling for smooth interaction under real-time data flow."
            ),
        )
    )
    story.append(
        compact_entry(
            title="YouTube English Comment Sentiment Analysis - Project Leader",
            subtitle="NLTK / TF-IDF / Word2Vec / LinearSVC / XGBoost / Streamlit",
            period="May. 2025 - Jun. 2025",
            body=(
                "Collected more than 50,000 comments across five topics; built and tuned "
                "classical-ML feature pipelines. Reported 90.5% validation accuracy and "
                "0.89 F1; deployed a sub-two-second Streamlit interface for 100+ internal users."
            ),
        )
    )
    story.append(
        compact_entry(
            title="Global Economic Data Analysis - Data Engineer",
            subtitle="Hadoop / Hive / Spark / Flink / Kafka",
            period="Nov. 2024 - Dec. 2024",
            body=(
                "Processed 8,519 records with 27 features on a three-node Hadoop cluster. "
                "Built batch and streaming pipelines across 150+ countries; reduced complex "
                "batch-query response time by 40% and improved time-series queries by 15%."
            ),
        )
    )
    story.append(
        compact_entry(
            title="ChatGDUFS Campus Q&A - NLP Developer",
            subtitle="LangChain / RAG / Chroma / Qwen-7B / LoRA / Flask",
            period="Nov. 2024 - Dec. 2024",
            body=(
                "Built a RAG pipeline with 2,000+ document embeddings and a sub-two-second "
                "Flask query API. Fine-tuned Qwen-7B with LoRA on 5,000 campus Q&A pairs, "
                "with reported domain accuracy improving from 72% to 86%."
            ),
        )
    )

    story.append(PageBreak())
    story.extend(section_heading("05 / Capability", "Technical Toolkit"))
    capabilities = Table(
        [
            [
                Paragraph("PROGRAMMING", LABEL),
                Paragraph("FRAMEWORKS &amp; SYSTEMS", LABEL),
                Paragraph("LANGUAGES", LABEL),
            ],
            [
                Paragraph(
                    "C++ / Java / Python / SQL / Vue 3 / React / JavaScript / Git",
                    SMALL,
                ),
                Paragraph(
                    "TensorFlow / PyTorch / MySQL / Docker / Redis / Hadoop / Spark / Flink / Kubernetes",
                    SMALL,
                ),
                Paragraph(
                    "English - IELTS 7<br/>Mandarin - Native<br/>Cantonese - Fluent",
                    SMALL,
                ),
            ],
        ],
        colWidths=[54 * mm, 68 * mm, 42 * mm],
    )
    capabilities.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), PAPER),
                ("BOX", (0, 0), (-1, -1), 0.55, RULE),
                ("INNERGRID", (0, 0), (-1, -1), 0.35, RULE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.extend([capabilities, Spacer(1, 7)])

    story.extend(section_heading("06 / Recognition", "Awards & Recognition"))
    awards = [
        "China International College Students' Innovation Competition - Outstanding Award, Jul. 2025.",
        "14th Challenge Cup Guangdong College Students Entrepreneurship Competition - Bronze Award, Jul. 2024.",
        "National College Students English Vocabulary Ability Competition - Third Prize (National), Jun. 2024.",
        "Guangdong University of Foreign Studies - Third-Class Scholarship for Outstanding Students, Oct. 2023.",
        "Guangdong Youth Science and Technology Innovation Competition - Silver Award, Oct. 2019.",
    ]
    for index, award in enumerate(awards, start=1):
        row = Table(
            [
                [
                    Paragraph(f"{index:02d}", LABEL),
                    Paragraph(escape(award), SMALL),
                ]
            ],
            colWidths=[12 * mm, 152 * mm],
        )
        row.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LINEBELOW", (0, 0), (-1, -1), 0.35, RULE),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                ]
            )
        )
        story.append(row)

    story.extend(section_heading("07 / Publication", "Publication"))
    story.append(
        Paragraph(
            "Yang, H., Bai, J., He, C., Wang, Y., &amp; Liang, W. (2024). "
            "Synthesis, characterization, and testing of rare earth-doped GdBO3 "
            "luminescent materials. <i>Guangdong Chemical Industry, 51</i>(10), 50-54.",
            CITATION,
        )
    )
    story.extend(
        [
            Spacer(1, 12),
            HRFlowable(width="100%", thickness=0.6, color=INK, spaceAfter=5),
            Paragraph(
                "PUBLIC SHARING NOTE  This document reproduces the professional content "
                "of the current CV while omitting private phone, email, and address details. "
                "For the bilingual, accessible version, visit computersciencefreshmen.github.io.",
                SMALL,
            ),
        ]
    )
    return story


def generate(output_path: Path) -> None:
    output_path.parent.mkdir(parents=True, exist_ok=True)
    document = SimpleDocTemplate(
        str(output_path),
        pagesize=A4,
        leftMargin=LEFT,
        rightMargin=RIGHT,
        topMargin=TOP,
        bottomMargin=BOTTOM,
        title="Hanyu Yang - Public CV",
        author="Hanyu Yang",
        subject="Public professional curriculum vitae",
    )
    document.build(build_story(), onFirstPage=draw_page, onLaterPages=draw_page)


def main() -> None:
    repository_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--output",
        type=Path,
        default=repository_root / "public" / "Hanyu_Yang_CV_Public.pdf",
        help="Destination PDF path.",
    )
    args = parser.parse_args()
    output = args.output.resolve()
    generate(output)
    print(f"Generated {output}")


if __name__ == "__main__":
    main()
