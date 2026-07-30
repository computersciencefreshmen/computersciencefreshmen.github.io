import type { JourneyItem, LocalizedText, Project } from "../types";

export const identity = {
  name: "Hanyu Yang",
  preferredName: "Henry",
  location: {
    en: "Guangzhou, China · UTC+8",
    zh: "中国广州 · UTC+8",
  } satisfies LocalizedText,
  portraitUrl: "https://github.com/computersciencefreshmen.png?size=720",
};

export const copy = {
  en: {
    nav: {
      work: "Selected work",
      about: "About",
      journey: "Journey",
      contact: "Contact",
    },
    languageLabel: "切换到中文",
    availability: "Open to thoughtful collaborations",
    heroKicker: "Product builder · Data thinker · Global learner",
    heroTitleLead: "I turn complex",
    heroTitleAccent: "real-world questions",
    heroTitleTail: "into useful digital systems.",
    heroBody:
      "I’m Hanyu (Henry) Yang, a software engineering graduate and incoming HKU postgraduate working where software, data, business, and international experiences meet.",
    exploreWork: "Explore selected work",
    connect: "Start a conversation",
    portraitAlt: "Portrait of Hanyu Yang",
    portraitCaption: "Hanyu “Henry” Yang",
    plateLabel: "Personal field notes · 2026",
    signalOne: "Ship",
    signalTwo: "Learn",
    signalThree: "Refine",
    proofLabel: "A quick read",
    proof: [
      ["05", "selected builds"],
      ["04", "live products"],
      ["02", "site languages"],
      ["∞", "curiosity"],
    ],
    workKicker: "01 / Selected work",
    workTitle: "Products with a point of view.",
    workIntro:
      "Each project begins with a real friction point: access to information, organizing knowledge, understanding data, or connecting across cultures.",
    viewLive: "Visit live product",
    viewCode: "View source",
    outcome: "Why it matters",
    aboutKicker: "02 / About",
    aboutTitle: "A translator between disciplines.",
    aboutLead:
      "The most interesting problems rarely fit inside one subject. I like moving between code, data, business context, and human behavior until the right shape becomes clear.",
    aboutBody:
      "My work is grounded in practical curiosity: understand the system, find the signal, build a usable first version, and improve it with evidence. That approach connects my university experience, work in financial services, and independent products.",
    principles: [
      {
        number: "A",
        title: "Useful before flashy",
        body: "Design is successful when it makes a difficult task feel obvious.",
      },
      {
        number: "B",
        title: "Evidence over assumption",
        body: "Data informs the decision; context explains what the numbers miss.",
      },
      {
        number: "C",
        title: "Build to understand",
        body: "A working prototype reveals questions that discussion alone cannot.",
      },
    ],
    toolkitLabel: "Current toolkit",
    toolkit: [
      "TypeScript",
      "React",
      "Vue",
      "Next.js",
      "Python",
      "Data analysis",
      "Product thinking",
      "AI workflows",
    ],
    journeyKicker: "03 / Journey",
    journeyTitle: "Learning in public, building in motion.",
    journeyIntro:
      "A non-linear path through university, financial services, data exploration, and self-directed product work.",
    contactKicker: "04 / Contact",
    contactTitle: "Have a useful problem worth exploring?",
    contactBody:
      "I’m always interested in thoughtful conversations about products, technology, data, international experiences, and ambitious early-stage ideas.",
    contactCta: "Connect on LinkedIn",
    githubCta: "Follow the build trail",
    footerNote: "Designed and built with intention.",
    copyright: "Hanyu Yang. All rights reserved.",
  },
  zh: {
    nav: {
      work: "精选项目",
      about: "关于我",
      journey: "成长轨迹",
      contact: "联系我",
    },
    languageLabel: "Switch to English",
    availability: "期待有价值的合作与交流",
    heroKicker: "产品构建者 · 数据思考者 · 全球学习者",
    heroTitleLead: "把复杂的",
    heroTitleAccent: "真实世界问题",
    heroTitleTail: "转化为有用的数字系统。",
    heroBody:
      "我是杨涵宇（Henry），一名软件工程毕业生与港大准研究生，持续探索软件、数据、商业与国际化体验的交汇处。",
    exploreWork: "查看精选项目",
    connect: "开始交流",
    portraitAlt: "杨涵宇的个人照片",
    portraitCaption: "杨涵宇 “Henry”",
    plateLabel: "个人研究手记 · 2026",
    signalOne: "交付",
    signalTwo: "学习",
    signalThree: "迭代",
    proofLabel: "快速了解",
    proof: [
      ["05", "个精选项目"],
      ["04", "个在线产品"],
      ["02", "种网站语言"],
      ["∞", "保持好奇"],
    ],
    workKicker: "01 / 精选项目",
    workTitle: "有明确立场的产品。",
    workIntro:
      "每个项目都从真实摩擦出发：信息获取、知识整理、数据理解，或跨文化连接。",
    viewLive: "访问在线产品",
    viewCode: "查看源码",
    outcome: "项目价值",
    aboutKicker: "02 / 关于我",
    aboutTitle: "连接不同学科的翻译者。",
    aboutLead:
      "最有趣的问题往往不属于单一学科。我喜欢在代码、数据、商业语境与人的行为之间移动，直到问题呈现出正确的形状。",
    aboutBody:
      "我的工作方法来自务实的好奇心：理解系统、发现信号、构建可用的第一版，再用证据持续改进。它连接着我的大学经历、金融服务实践与独立产品探索。",
    principles: [
      {
        number: "A",
        title: "有用优先于炫技",
        body: "当一个困难任务变得直观，设计才真正成功。",
      },
      {
        number: "B",
        title: "证据优先于假设",
        body: "数据帮助决策，语境解释数字没有表达的部分。",
      },
      {
        number: "C",
        title: "通过构建来理解",
        body: "可运行的原型会揭示纯讨论无法发现的问题。",
      },
    ],
    toolkitLabel: "当前工具箱",
    toolkit: [
      "TypeScript",
      "React",
      "Vue",
      "Next.js",
      "Python",
      "数据分析",
      "产品思维",
      "AI 工作流",
    ],
    journeyKicker: "03 / 成长轨迹",
    journeyTitle: "公开学习，持续构建。",
    journeyIntro:
      "一条穿过大学、金融服务、数据探索与自主产品实践的非线性路径。",
    contactKicker: "04 / 联系我",
    contactTitle: "有一个值得探索的真实问题？",
    contactBody:
      "我期待关于产品、技术、数据、国际化体验与早期创新想法的真诚交流。",
    contactCta: "在 LinkedIn 联系",
    githubCta: "查看我的构建轨迹",
    footerNote: "以思考与用心完成设计和开发。",
    copyright: "杨涵宇。保留所有权利。",
  },
} as const;

export const projects: Project[] = [
  {
    id: "study-in-china",
    number: "01",
    title: "StudyInChina",
    eyebrow: {
      en: "International education · Product",
      zh: "国际教育 · 产品",
    },
    description: {
      en: "A decision-support experience that helps international students navigate studying and living in China with clearer, more approachable information.",
      zh: "一个面向国际学生的留学中国决策体验，以更清晰、更易理解的信息降低学习与生活选择成本。",
    },
    impact: {
      en: "Turns a fragmented, high-stakes research journey into a guided digital path.",
      zh: "把碎片化且高成本的信息搜索过程，转化为有引导的数字路径。",
    },
    technologies: ["TypeScript", "Next.js", "Product design"],
    repositoryUrl: "https://github.com/computersciencefreshmen/StudyInChina",
    liveUrl: "https://studyinchina.vercel.app",
    tone: "mint",
  },
  {
    id: "noteprompt",
    number: "02",
    title: "NotePrompt",
    eyebrow: {
      en: "AI workflow · Knowledge system",
      zh: "AI 工作流 · 知识系统",
    },
    description: {
      en: "A modern workspace for organizing, refining, and reusing prompts—designed to turn scattered AI experiments into durable knowledge.",
      zh: "一个用于整理、改进和复用提示词的现代工作空间，让零散的 AI 实验沉淀为可持续使用的知识。",
    },
    impact: {
      en: "Treats prompts as evolving intellectual assets instead of disposable chat fragments.",
      zh: "把提示词视为持续进化的知识资产，而不是一次性的聊天片段。",
    },
    technologies: ["TypeScript", "Next.js", "AI workflows"],
    repositoryUrl: "https://github.com/computersciencefreshmen/NotePrompt",
    liveUrl: "https://noteprompt.cn/",
    tone: "amber",
  },
  {
    id: "japan-receipt-journal",
    number: "03",
    title: "Japan Receipt Journal",
    eyebrow: {
      en: "Data storytelling · Travel",
      zh: "数据叙事 · 旅行",
    },
    description: {
      en: "A bilingual, human-audited travel data story built from 101 pages of receipts, combining daily spend, payment patterns, a receipt wall, and a searchable ledger.",
      zh: "一份由 101 页日本旅行小票构建、经人工核验的双语数据故事，涵盖每日消费、支付方式、小票墙和可搜索账本。",
    },
    impact: {
      en: "Makes personal data legible, trustworthy, and emotionally connected to the journey behind it.",
      zh: "让个人数据既可读、可信，也保留数字背后的旅行记忆。",
    },
    technologies: ["TypeScript", "Data visualization", "Bilingual UX"],
    repositoryUrl:
      "https://github.com/computersciencefreshmen/japan-receipt-journal",
    liveUrl: "https://japan-receipt-journal.vercel.app/en",
    tone: "rose",
  },
  {
    id: "international-chinese-platform",
    number: "04",
    title: "International Chinese Platform",
    eyebrow: {
      en: "Cross-cultural learning · Platform",
      zh: "跨文化学习 · 平台",
    },
    description: {
      en: "A web platform exploring how international learners can access Chinese-language and cultural resources through a clearer digital experience.",
      zh: "一个探索国际学习者如何通过更清晰的数字体验获取中文与文化资源的 Web 平台。",
    },
    impact: {
      en: "Connects technical delivery with a long-term interest in cultural access and international exchange.",
      zh: "把技术交付与文化可及性、国际交流的长期兴趣连接起来。",
    },
    technologies: ["Vue", "JavaScript", "Responsive UI"],
    repositoryUrl:
      "https://github.com/computersciencefreshmen/International_Chinese_Platform",
    liveUrl: "https://international-chinese-platform.vercel.app",
    tone: "blue",
  },
  {
    id: "youtube-sentiment",
    number: "05",
    title: "YouTube Sentiment Analysis",
    eyebrow: {
      en: "NLP · Applied research",
      zh: "自然语言处理 · 应用研究",
    },
    description: {
      en: "An applied natural-language processing project examining sentiment in YouTube text with BERT-based modeling.",
      zh: "一个使用 BERT 模型分析 YouTube 文本情感的自然语言处理应用项目。",
    },
    impact: {
      en: "Explores how modern language models can turn unstructured audience reactions into analyzable signals.",
      zh: "探索现代语言模型如何把非结构化的用户反馈转化为可分析信号。",
    },
    technologies: ["Python", "BERT", "NLP"],
    repositoryUrl:
      "https://github.com/computersciencefreshmen/YouTube_Sentiment_Analysis_BERT",
    tone: "violet",
  },
];

export const journey: JourneyItem[] = [
  {
    period: "2022 — 2026",
    title: {
      en: "Undergraduate studies",
      zh: "本科阶段",
    },
    organization: {
      en: "Guangdong University of Foreign Studies",
      zh: "广东外语外贸大学",
    },
    description: {
      en: "Building an interdisciplinary foundation while contributing to the Data Mining Laboratory and leading on the university badminton team.",
      zh: "构建跨学科基础，同时参与数据挖掘实验室，并在校羽毛球队承担团队领导工作。",
    },
  },
  {
    period: "Mar. - Jul. 2026",
    title: {
      en: "Financial services experience",
      zh: "金融服务实践",
    },
    organization: {
      en: "HSBC · Guangzhou",
      zh: "汇丰银行 · 广州",
    },
    description: {
      en: "Learning how large organizations, customer needs, and operational systems meet in real-world financial services.",
      zh: "在真实金融服务环境中理解大型组织、客户需求与运营系统如何协同。",
    },
  },
  {
    period: "2025 — Now",
    title: {
      en: "Independent product building",
      zh: "独立产品构建",
    },
    organization: {
      en: "Open-source and live products",
      zh: "开源项目与在线产品",
    },
    description: {
      en: "Shipping web products across international education, AI knowledge workflows, cultural access, NLP, and personal data storytelling.",
      zh: "持续交付覆盖国际教育、AI 知识工作流、文化可及性、自然语言处理和个人数据叙事的 Web 产品。",
    },
  },
];

export const links = {
  github: "https://github.com/computersciencefreshmen",
  linkedin: "https://www.linkedin.com/in/henryyanghy",
  instagram: "https://www.instagram.com/henrythefoodiee/",
};
