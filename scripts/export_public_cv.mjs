/**
 * Export the website's public CV records for the PDF renderer.
 *
 * Node 24 strips TypeScript's type-only syntax, so these records remain the
 * single source of truth for both the accessible website and all PDF editions.
 * Translation lookup is intentionally strict: a missing sentence must stop an
 * export instead of producing an unnoticed English fallback in another locale.
 */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  achievements,
  cvProjects,
  education,
  hsbcExperience,
  publication,
  publicCvUrls,
  research,
  skills,
  xinAnExperience,
} from "../src/data/cv.ts";
import { identity, links } from "../src/data/portfolio.ts";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const locales = [
  { code: "en", name: "English", tag: "en" },
  { code: "zh", name: "简体中文", tag: "zh-CN" },
  { code: "de", name: "Deutsch", tag: "de" },
  { code: "fr", name: "Français", tag: "fr" },
  { code: "it", name: "Italiano", tag: "it" },
  { code: "ru", name: "Русский", tag: "ru" },
  { code: "es", name: "Español", tag: "es" },
  { code: "uk", name: "Українська", tag: "uk" },
];

// These identifiers are intentionally language independent. Words describing
// a capability (for example "Virtual scrolling") still require a translation.
const technicalTerms = new Set([
  "SQL", "Python", "GCP BigQuery", "Data Science Workbench", "SmartCRM",
  "PEGA", "UAT", "MCP", "Dify", "REST API", "BERT", "ResNet-50", "CLIP",
  "CNN", "AlexNet", "PyTorch", "YOLOv5s", "GhostNet", "CBAM", "Vue 3",
  "Composition API", "NLTK", "LinearSVC", "XGBoost", "Streamlit", "Hadoop",
  "Hive", "Spark", "Flink", "Kafka", "LangChain", "RAG", "Chroma", "Qwen-7B",
  "LoRA", "Flask", "C++", "Java", "React", "JavaScript", "Git", "TensorFlow",
  "MySQL", "Docker", "Redis", "Kubernetes",
  "Full-stack",
]);

// Catalogs already make the deliberate choice to preserve official institutional
// names. HSBC has no catalog entry because its brand is the same across locales.
const properNames = new Set([
  "HSBC", "Guangzhou Xin'an Data Co., Ltd.", "The University of Hong Kong",
  "Guangdong University of Foreign Studies", "University of Cambridge",
  "Guangdong University of Foreign Studies · School of Information Science and Technology",
  "Guangzhou, China",
  // This is also the standard English qualification title in the German catalog.
  "Bachelor of Science in Software Engineering",
]);

async function readJson(relativePath) {
  return JSON.parse(await readFile(join(repositoryRoot, relativePath), "utf8"));
}

const pdfCopy = await readJson("src/data/public-cv-copy.json");
const dictionaries = Object.fromEntries(await Promise.all(
  locales.filter(({ code }) => code !== "en").map(async ({ code }) => [
    code,
    await readJson(code === "zh" ? "src/i18n/source.json" : `src/i18n/locales/${code}.json`),
  ]),
));

function text(message, locale) {
  assert.equal(typeof message, "string", `Expected source text for ${locale}`);
  assert.ok(message.trim(), `Empty source text for ${locale}`);
  if (locale === "en") return message;
  const result = dictionaries[locale][message];
  if (result === undefined) {
    assert.ok(technicalTerms.has(message) || properNames.has(message),
      `Missing ${locale} translation: ${message}`);
    return message;
  }
  assert.equal(typeof result, "string", `Invalid ${locale} translation: ${message}`);
  assert.ok(result.trim(), `Empty ${locale} translation: ${message}`);
  assert.ok(result !== message || technicalTerms.has(message) || properNames.has(message),
    `Unexpected unchanged ${locale} translation: ${message}`);
  return result;
}

function pair(value, locale) {
  if (locale === "zh") {
    assert.equal(typeof value.zh, "string", `Missing Chinese source for ${value.en}`);
    assert.ok(value.zh.trim(), `Empty Chinese source for ${value.en}`);
    return value.zh;
  }
  return text(value.en, locale);
}

function period(value, locale) {
  const months = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6,
    Aug: 7, Sept: 8, Oct: 9, Nov: 10, Dec: 11 };
  const tag = locales.find(({ code }) => code === locale).tag;
  const formatter = new Intl.DateTimeFormat(tag, {
    year: "numeric", month: "short", timeZone: "UTC",
  });
  return value.replace(
    /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec)\.? (\d{4})/g,
    (_, month, year) => formatter.format(new Date(Date.UTC(Number(year), months[month], 1))),
  );
}

function entry(value, locale) {
  return {
    id: value.id,
    period: period(value.period, locale),
    title: pair(value.title ?? value.degree, locale),
    organization: pair(value.organization ?? value.institution, locale),
    location: pair(value.location, locale),
    bullets: (value.bullets ?? value.details).map((item) => pair(item, locale)),
    technologies: (value.technologies ?? []).map((item) => text(item, locale)),
  };
}

// Decimal/thousands punctuation varies across locales. Canonicalization lets us
// compare the factual digits without penalizing legitimate localized formatting.
function numbers(value) {
  return (value.match(/\d+(?:[.,]\d+|[ \u00a0\u202f]\d{3}(?!\d))*/g) ?? [])
    .map((number) => number.replace(/[.,\s\u00a0\u202f]/g, ""));
}

function checkNumericFacts(source, localized, context) {
  for (const number of numbers(source)) {
    assert.ok(numbers(localized).includes(number),
      `Numeric fact ${number} changed or disappeared in ${context}`);
  }
}

function checkRecords(source, localized, locale, section) {
  assert.equal(localized.length, source.length, `${locale} ${section} count drifted`);
  source.forEach((record, index) => {
    const result = localized[index];
    assert.equal(result.id, record.id, `${locale} ${section} ID drifted`);
    const bullets = record.bullets ?? record.details;
    assert.equal(result.bullets.length, bullets.length,
      `${locale} ${record.id} bullet count drifted`);
    assert.equal(result.technologies.length, record.technologies?.length ?? 0,
      `${locale} ${record.id} technology count drifted`);
    checkNumericFacts(record.period, result.period, `${locale} ${record.id} dates`);
    bullets.forEach((bullet, bulletIndex) => checkNumericFacts(
      bullet.en, result.bullets[bulletIndex], `${locale} ${record.id} bullet ${bulletIndex + 1}`,
    ));
  });
}

const websiteLinks = [
  { label: "computersciencefreshmen.github.io", url: "https://computersciencefreshmen.github.io/" },
  { label: links.github.replace(/^https?:\/\//, ""), url: links.github },
  { label: links.linkedin.replace(/^https?:\/\/(?:www\.)?/, ""), url: links.linkedin },
];

function documentData({ code, name, tag }) {
  const copy = pdfCopy[code];
  assert.ok(copy, `Missing PDF copy for ${code}`);
  assert.deepEqual(Object.keys(copy.labels).sort(), [
    "profile", "experience", "education", "research", "projects", "skills",
    "awards", "publication", "tools", "publicCv", "publicSharingNote",
  ].sort(), `PDF label keys differ for ${code}`);
  for (const value of [copy.profile, copy.tagline, copy.sharingNote, ...Object.values(copy.labels)]) {
    assert.equal(typeof value, "string", `Invalid PDF copy for ${code}`);
    assert.ok(value.trim(), `Empty PDF copy for ${code}`);
  }
  const data = {
    schemaVersion: 1,
    locale: code,
    languageName: name,
    tag,
    name: code === "zh" ? "杨涵宇" : identity.name,
    profile: copy.profile,
    tagline: copy.tagline,
    labels: copy.labels,
    sharingNote: copy.sharingNote,
    footerMonth: new Intl.DateTimeFormat(tag, {
      year: "numeric", month: "long", timeZone: "UTC",
    }).format(new Date(Date.UTC(2026, 9, 1))),
    links: websiteLinks,
    experience: [hsbcExperience, xinAnExperience].map((value) => entry(value, code)),
    education: education.map((value) => entry(value, code)),
    research: research.map((value) => entry(value, code)),
    projects: cvProjects.map((value) => entry(value, code)),
    skills: skills.map((group) => ({
      label: pair(group.label, code), values: group.values.map((value) => text(value, code)),
    })),
    awards: achievements.map((value) => pair(value, code)),
    publication: code === "en" || code === "zh" ? pair(publication, code) : copy.publication,
  };
  checkRecords([hsbcExperience, xinAnExperience], data.experience, code, "experience");
  checkRecords(education, data.education, code, "education");
  checkRecords(research, data.research, code, "research");
  checkRecords(cvProjects, data.projects, code, "projects");
  assert.equal(data.skills.length, skills.length);
  assert.equal(data.awards.length, achievements.length);
  assert.equal(typeof data.publication, "string", `Missing publication for ${code}`);
  checkNumericFacts(publication.en, data.publication, `${code} publication`);
  // Award ordinals can be written out (e.g. Chinese 第十四届); years must remain.
  achievements.forEach((award, index) => {
    for (const year of award.en.match(/\b(?:19|20)\d{2}\b/g) ?? []) {
      assert.ok(data.awards[index].includes(year), `${code} award ${index + 1} year changed`);
    }
  });
  return data;
}

function parseOutput() {
  const args = process.argv.slice(2);
  if (args.length === 0) return join(repositoryRoot, "artifacts", "public-cv-data");
  if (args.length === 2 && args[0] === "--output") return resolve(args[1]);
  if (args.length === 1 && ["--help", "-h"].includes(args[0])) {
    process.stdout.write("Usage: node scripts/export_public_cv.mjs [--output DIRECTORY]\n");
    process.exit(0);
  }
  throw new Error("Usage: node scripts/export_public_cv.mjs [--output DIRECTORY]");
}

const output = parseOutput();
assert.deepEqual(Object.keys(publicCvUrls).sort(), locales.map(({ code }) => code).sort(),
  "Exporter languages must match the website PDF download map");
assert.deepEqual(Object.keys(pdfCopy).sort(), locales.map(({ code }) => code).sort(),
  "PDF copy must cover exactly the website's eight languages");
// Validate every language before writing any output, avoiding a partial export.
const documents = locales.map(documentData);
await mkdir(output, { recursive: true });
await Promise.all(documents.map((data) => writeFile(
  join(output, `${data.locale}.json`), `${JSON.stringify(data, null, 2)}\n`, "utf8",
)));
process.stdout.write(`Exported ${documents.length} complete public CV language editions to ${output}\n`);
