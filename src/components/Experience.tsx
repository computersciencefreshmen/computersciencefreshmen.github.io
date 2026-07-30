import { hsbcExperience, publicCvUrl } from "../data/cv";
import type { Locale, LocalizedText } from "../types";
import { ArrowUpRight } from "./Icons";
import { Reveal } from "./Reveal";
import "../styles/cv.css";

interface ExperienceProps {
  locale: Locale;
}

const experienceCopy = {
  en: {
    kicker: "Casefile / HSBC · WPB",
    titleLead: "Customer data,",
    titleAccent: "made actionable.",
    intro:
      "Inside Wealth and Personal Banking, I worked across the full CRM decision chain: joining fragmented customer signals, finding useful patterns, shaping campaign logic, and helping coordinated messages reach the right channels.",
    source: "Current CV · Mar. 2026 - Jul. 2026",
    roleLabel: "Role",
    locationLabel: "Base",
    systemLabel: "Operating system",
    systemValue: "Data → Insight → Decision → Delivery",
    flowLabel: "How the work moved",
    detailLabel: "What I contributed",
    toolkitLabel: "Platforms & methods",
    cvCta: "Open public CV",
    cvNote: "Complete, privacy-safe PDF",
  },
  zh: {
    kicker: "重点档案 / 汇丰银行 · WPB",
    titleLead: "让客户数据",
    titleAccent: "转化为行动。",
    intro:
      "在财富管理及个人银行业务中，我参与了 CRM 决策链条的多个环节：连接分散的客户信号、提取可用洞察、支持营销策略，并协助跨渠道触达顺利交付。",
    source: "当前 CV · 2026 年 3 月 - 2026 年 7 月",
    roleLabel: "岗位",
    locationLabel: "地点",
    systemLabel: "工作链路",
    systemValue: "数据 → 洞察 → 决策 → 交付",
    flowLabel: "工作如何流动",
    detailLabel: "具体贡献",
    toolkitLabel: "平台与方法",
    cvCta: "查看公开版 CV",
    cvNote: "完整、隐私安全的 PDF",
  },
} as const;

const flow: Array<{
  number: string;
  title: LocalizedText;
  body: LocalizedText;
  signal: string;
}> = [
  {
    number: "01",
    title: { en: "Unify", zh: "统一" },
    body: {
      en: "Core banking, card, and mobile-channel data become one customer view.",
      zh: "把核心银行、信用卡与移动端数据汇入统一客户视图。",
    },
    signal: "SQL / BigQuery",
  },
  {
    number: "02",
    title: { en: "Understand", zh: "洞察" },
    body: {
      en: "Cleaning, EDA, and predictive models reveal useful customer segments.",
      zh: "通过清洗、探索性分析和预测建模识别有效客户分群。",
    },
    signal: "Python / Modeling",
  },
  {
    number: "03",
    title: { en: "Decide", zh: "决策" },
    body: {
      en: "Evidence informs precision-marketing logic and lifecycle decisions.",
      zh: "用证据支持精准营销逻辑与客户生命周期决策。",
    },
    signal: "SmartCRM / PEGA",
  },
  {
    number: "04",
    title: { en: "Deliver", zh: "交付" },
    body: {
      en: "UAT, schedules, and sign-offs align in-app, eDM, and push delivery.",
      zh: "以 UAT、排期和相关方确认协同 App、eDM 与推送交付。",
    },
    signal: "UAT / Omnichannel",
  },
];

export function Experience({ locale }: ExperienceProps) {
  const content = experienceCopy[locale];

  return (
    <section
      id="experience"
      className="section section--experience"
      aria-labelledby="experience-title"
    >
      <Reveal className="experience-heading">
        <div>
          <p className="section-kicker">{content.kicker}</p>
          <h2 id="experience-title">
            {content.titleLead} <em>{content.titleAccent}</em>
          </h2>
        </div>
        <div className="experience-heading__aside">
          <p>{content.intro}</p>
          <span>{content.source}</span>
        </div>
      </Reveal>

      <Reveal className="hsbc-casefile">
        <div className="hsbc-casefile__masthead">
          <div className="hsbc-wordmark" aria-label={hsbcExperience.organization[locale]}>
            <span className="hsbc-wordmark__signal" aria-hidden="true" />
            <strong>{hsbcExperience.organization[locale]}</strong>
          </div>

          <dl className="hsbc-casefile__metadata">
            <div>
              <dt>{content.roleLabel}</dt>
              <dd>{hsbcExperience.title[locale]}</dd>
            </div>
            <div>
              <dt>{content.locationLabel}</dt>
              <dd>{hsbcExperience.location[locale]}</dd>
            </div>
            <div>
              <dt>{content.systemLabel}</dt>
              <dd>{content.systemValue}</dd>
            </div>
          </dl>
        </div>

        <div className="hsbc-flow">
          <p className="hsbc-flow__label">{content.flowLabel}</p>
          <ol>
            {flow.map((step) => (
              <li key={step.number}>
                <div className="hsbc-flow__index">
                  <span>{step.number}</span>
                  <small>{step.signal}</small>
                </div>
                <h3>{step.title[locale]}</h3>
                <p>{step.body[locale]}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="hsbc-casefile__details">
          <div className="hsbc-casefile__legend">
            <p>{content.detailLabel}</p>
            <span aria-hidden="true">WPB / CRM / 2026</span>
          </div>
          <ol className="hsbc-contributions">
            {hsbcExperience.bullets.map((bullet, index) => (
              <li key={bullet.en}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <p>{bullet[locale]}</p>
              </li>
            ))}
          </ol>
        </div>

        <div className="hsbc-casefile__footer">
          <div>
            <p>{content.toolkitLabel}</p>
            <ul aria-label={content.toolkitLabel}>
              {hsbcExperience.technologies?.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </div>
          <a href={publicCvUrl} target="_blank" rel="noreferrer">
            <span>
              <strong>{content.cvCta}</strong>
              <small>{content.cvNote}</small>
            </span>
            <ArrowUpRight />
          </a>
        </div>
      </Reveal>
    </section>
  );
}
