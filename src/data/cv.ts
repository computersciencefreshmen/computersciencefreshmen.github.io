import type { LocalizedText } from "../types";

export interface CvEntry {
  id: string;
  period: string;
  title: LocalizedText;
  organization: LocalizedText;
  location: LocalizedText;
  bullets: LocalizedText[];
  technologies?: string[];
}

export interface EducationEntry {
  id: string;
  period: string;
  degree: LocalizedText;
  institution: LocalizedText;
  location: LocalizedText;
  details: LocalizedText[];
}

export const publicCvUrl = "/Hanyu_Yang_CV_Public.pdf";

export const hsbcExperience: CvEntry = {
  id: "hsbc-crm-data-analyst",
  period: "Mar. 2026 - Jul. 2026",
  title: {
    en: "CRM Data Analyst Intern · Wealth and Personal Banking",
    zh: "CRM 数据分析实习生 · 财富管理及个人银行业务",
  },
  organization: {
    en: "HSBC",
    zh: "汇丰银行",
  },
  location: {
    en: "Guangzhou, China",
    zh: "中国广州",
  },
  bullets: [
    {
      en: "Integrated customer data from core banking, credit-card, and mobile channels with SQL and Python on GCP BigQuery and Data Science Workbench, building a unified customer view and tagging system for precise WPB client profiling.",
      zh: "使用 SQL 与 Python，在 GCP BigQuery 和 Data Science Workbench 上整合核心银行、信用卡及移动端等多源客户数据，构建统一客户视图与标签体系，支持财富管理及个人银行客户的精准画像。",
    },
    {
      en: "Performed data cleaning, exploratory analysis, and predictive modeling in Python to support customer segmentation and evidence-led marketing campaign decisions.",
      zh: "使用 Python 完成数据清洗、探索性分析和预测建模，为客户分群与数据驱动的营销活动决策提供支持。",
    },
    {
      en: "Contributed to precision-marketing strategy and campaign deployment through SmartCRM and the PEGA decisioning platform, supporting omni-channel customer lifecycle management.",
      zh: "参与精准营销策略制定，并通过 SmartCRM 与 PEGA 决策平台协助部署客户触达活动，支持全渠道客户生命周期管理。",
    },
    {
      en: "Supported omnichannel customer-communications delivery by coordinating handover requirements, UAT inputs, execution readiness, channel schedules, and stakeholder sign-offs across in-app, eDM, and marketing-push journeys.",
      zh: "支持全渠道客户沟通活动交付，协调交接要求、UAT 输入、上线准备、渠道排期与相关方确认，覆盖 App 内触达、eDM 及营销推送。",
    },
  ],
  technologies: [
    "SQL",
    "Python",
    "GCP BigQuery",
    "Data Science Workbench",
    "SmartCRM",
    "PEGA",
    "UAT",
  ],
};

export const xinAnExperience: CvEntry = {
  id: "xinan-ai-development",
  period: "Jul. 2025 - Aug. 2025",
  title: {
    en: "AI Development Intern · Digital Innovation Department",
    zh: "AI 开发实习生 · 数字创新部",
  },
  organization: {
    en: "Guangzhou Xin'an Data Co., Ltd.",
    zh: "广州信安数据有限公司",
  },
  location: {
    en: "Guangzhou, China",
    zh: "中国广州",
  },
  bullets: [
    {
      en: "Designed and deployed a full-stack AI prompt-optimization platform with authentication, community libraries, and knowledge-sharing capabilities for more than 100 internal users.",
      zh: "设计并部署全栈 AI 提示词优化平台，包含用户认证、社区提示词库与知识分享能力，服务 100 多名内部用户。",
    },
    {
      en: "Integrated Model Context Protocol with Dify to automate AI-driven reporting workflows.",
      zh: "将模型上下文协议（MCP）与 Dify 平台集成，实现 AI 驱动报告流程的自动化。",
    },
    {
      en: "Developed RESTful APIs for third-party integration and enterprise data exchange.",
      zh: "开发面向第三方系统集成的 RESTful API，支持企业级数据交换与 AI 解决方案部署。",
    },
  ],
  technologies: ["MCP", "Dify", "REST API", "Full-stack", "AI workflows"],
};

export const education: EducationEntry[] = [
  {
    id: "hku-ma",
    period: "Sept. 2026 - Aug. 2027 (Expected)",
    degree: {
      en: "Master of Arts in AI, Ethics and Society",
      zh: "人工智能、伦理与社会文学硕士",
    },
    institution: {
      en: "The University of Hong Kong",
      zh: "香港大学",
    },
    location: {
      en: "Hong Kong SAR",
      zh: "中国香港",
    },
    details: [
      {
        en: "Incoming postgraduate study connecting AI systems with their ethical and societal contexts.",
        zh: "即将开始的研究生阶段，聚焦人工智能系统与伦理、社会语境的交叉问题。",
      },
    ],
  },
  {
    id: "gdufs-bsc",
    period: "Sept. 2022 - Jun. 2026",
    degree: {
      en: "Bachelor of Science in Software Engineering",
      zh: "软件工程理学学士",
    },
    institution: {
      en: "Guangdong University of Foreign Studies · School of Information Science and Technology",
      zh: "广东外语外贸大学 · 信息科学与技术学院",
    },
    location: {
      en: "Guangzhou, China",
      zh: "中国广州",
    },
    details: [
      {
        en: "GPA: 88/100 · Top 20%.",
        zh: "平均成绩：88/100 · 专业前 20%。",
      },
      {
        en: "Selected modules: Text Information Processing (99), Network Programming (96), Natural Language Processing (96), Software Architecture (96), Big Data Processing Technology (94), Further Mathematics (91), and Web Design (90).",
        zh: "核心课程：文本信息处理（99）、网络编程（96）、自然语言处理（96）、软件体系结构（96）、大数据处理技术（94）、高等数学（91）与网页设计（90）。",
      },
    ],
  },
];

export const research: CvEntry[] = [
  {
    id: "fake-news-detection",
    period: "Oct. 2024 - Dec. 2024",
    title: {
      en: "Research Contributor · Fake News Detection through Multimodal Attention",
      zh: "研究成员 · 基于多模态注意力的虚假新闻检测",
    },
    organization: {
      en: "Guangdong University of Foreign Studies",
      zh: "广东外语外贸大学",
    },
    location: {
      en: "Guangzhou, China",
      zh: "中国广州",
    },
    bullets: [
      {
        en: "Proposed a semantic-conflict recognition and multimodal-attention framework for image-text inconsistency.",
        zh: "提出融合语义冲突识别与多模态注意力的框架，用于处理图文不一致问题。",
      },
      {
        en: "Added KL-divergence and MSE modules to CLIP alignment for quantifying cross-modal semantic discrepancies.",
        zh: "在 CLIP 对齐中加入 KL 散度与 MSE 模块，量化跨模态语义差异。",
      },
      {
        en: "Combined BERT, ResNet-50, and cross-modal self-attention, reaching 88.9% accuracy and improving on the CLIP baseline by 2.8%.",
        zh: "结合 BERT、ResNet-50 与跨模态自注意力，实现 88.9% 准确率，较 CLIP 基线提升 2.8%。",
      },
    ],
    technologies: ["BERT", "ResNet-50", "CLIP", "Multimodal attention"],
  },
  {
    id: "skin-cancer-classification",
    period: "Aug. 2024",
    title: {
      en: "Research Leader · Skin Cancer Classification with CNN and Attention",
      zh: "研究负责人 · 基于 CNN 与注意力机制的皮肤癌分类",
    },
    organization: {
      en: "University of Cambridge",
      zh: "剑桥大学",
    },
    location: {
      en: "Cambridge, UK",
      zh: "英国剑桥",
    },
    bullets: [
      {
        en: "Led development of a lightweight enhanced-AlexNet CNN for benign-versus-malignant dermoscopic lesion classification.",
        zh: "带领团队开发基于改进 AlexNet 的轻量级 CNN，用于皮肤镜病灶良恶性分类。",
      },
      {
        en: "Integrated spatial attention to focus the model on diagnostically relevant regions.",
        zh: "集成空间注意力模块，使模型聚焦具有诊断意义的图像区域。",
      },
      {
        en: "Improved classification accuracy by 15% through preprocessing optimization and background-noise suppression.",
        zh: "通过优化图像预处理与抑制背景噪声，将分类准确率提升 15%。",
      },
    ],
    technologies: ["CNN", "AlexNet", "Spatial attention", "Medical imaging"],
  },
  {
    id: "autonomous-parking",
    period: "Oct. 2023 - Nov. 2023",
    title: {
      en: "Algorithm Designer · Autonomous Parking Detection",
      zh: "算法设计者 · 基于深度学习的自主泊车检测",
    },
    organization: {
      en: "Guangdong University of Foreign Studies",
      zh: "广东外语外贸大学",
    },
    location: {
      en: "Guangzhou, China",
      zh: "中国广州",
    },
    bullets: [
      {
        en: "Redesigned YOLOv5s with a GhostNet backbone and CBAM attention for parking-slot detection under occlusion and variable lighting.",
        zh: "以 GhostNet 主干网络与 CBAM 注意力改造 YOLOv5s，提高遮挡与复杂光照下的车位检测能力。",
      },
      {
        en: "Trained in PyTorch with RMSProp and Mosaic augmentation for 500 epochs on RTX 3090.",
        zh: "使用 PyTorch、RMSProp 与 Mosaic 数据增强，在 RTX 3090 环境训练 500 个 epoch。",
      },
      {
        en: "Reached 97.1% AP and 93.7% AR while reducing inference latency by 20% against the YOLOv5s baseline.",
        zh: "实现 97.1% AP 与 93.7% AR，并较 YOLOv5s 基线降低 20% 推理延迟。",
      },
    ],
    technologies: ["PyTorch", "YOLOv5s", "GhostNet", "CBAM"],
  },
];

export const cvProjects: CvEntry[] = [
  {
    id: "international-chinese-education",
    period: "Apr. 2025 - Jul. 2025",
    title: {
      en: "Front-End Developer · International Chinese Education Platform",
      zh: "前端开发者 · 国际中文教育平台",
    },
    organization: {
      en: "Guangdong University of Foreign Studies",
      zh: "广东外语外贸大学",
    },
    location: {
      en: "Guangzhou, China",
      zh: "中国广州",
    },
    bullets: [
      {
        en: "Built a responsive Vue 3 student portal with real-time class management and messaging for more than 500 international students.",
        zh: "使用 Vue 3 构建响应式学生门户，为 500 多名国际学生提供实时课堂管理与消息功能。",
      },
      {
        en: "Redesigned live-class and chat layouts to improve clarity, responsiveness, and engagement.",
        zh: "重构直播课堂与聊天模块布局，提升界面清晰度、响应式表现与用户参与度。",
      },
      {
        en: "Added lazy loading and virtual scrolling for smooth interaction under real-time data flow.",
        zh: "加入懒加载与虚拟滚动，使实时数据流下的交互保持流畅。",
      },
    ],
    technologies: ["Vue 3", "Composition API", "Virtual scrolling"],
  },
  {
    id: "youtube-sentiment-classical",
    period: "May. 2025 - Jun. 2025",
    title: {
      en: "Project Leader · YouTube Sentiment Analysis on English Comments",
      zh: "项目负责人 · YouTube 英文评论情感分析",
    },
    organization: {
      en: "Guangdong University of Foreign Studies",
      zh: "广东外语外贸大学",
    },
    location: {
      en: "Guangzhou, China",
      zh: "中国广州",
    },
    bullets: [
      {
        en: "Collected more than 50,000 English comments across five topics through the YouTube API.",
        zh: "通过 YouTube API 采集 5 类主题下的 50,000 多条英文评论。",
      },
      {
        en: "Built NLTK preprocessing and TF-IDF/Word2Vec feature pipelines, then tuned LinearSVC and XGBoost with GridSearchCV.",
        zh: "构建 NLTK 预处理与 TF-IDF/Word2Vec 特征管线，并使用 GridSearchCV 调优 LinearSVC 和 XGBoost。",
      },
      {
        en: "Reported 90.5% validation accuracy and 0.89 F1 for the classical-ML pipeline.",
        zh: "该传统机器学习管线在验证集上报告 90.5% 准确率与 0.89 F1。",
      },
      {
        en: "Deployed a Streamlit prediction interface for more than 100 internal users with average response below two seconds.",
        zh: "部署 Streamlit 实时预测界面，服务 100 多名内部用户，平均响应时间低于 2 秒。",
      },
    ],
    technologies: ["Python", "NLTK", "LinearSVC", "XGBoost", "Streamlit"],
  },
  {
    id: "global-economic-data",
    period: "Nov. 2024 - Dec. 2024",
    title: {
      en: "Data Engineer · Global Economic Data Analysis",
      zh: "数据工程师 · 全球经济数据分析",
    },
    organization: {
      en: "Course engineering project",
      zh: "课程工程项目",
    },
    location: {
      en: "Guangzhou, China",
      zh: "中国广州",
    },
    bullets: [
      {
        en: "Processed 8,519 records with 27 features through Hadoop HDFS on a three-node cluster.",
        zh: "在三节点集群上使用 Hadoop HDFS 处理包含 27 个特征的 8,519 条记录。",
      },
      {
        en: "Built HiveQL aggregation, PySpark GDP analysis across more than 150 countries, and Flink/Kafka streaming pipelines.",
        zh: "构建 HiveQL 聚合、覆盖 150 多个国家的 PySpark GDP 分析，以及 Flink/Kafka 流式处理管线。",
      },
      {
        en: "Reduced complex batch-query response time by 40% with Spark and improved time-series query efficiency by 15% through Hive partitioning.",
        zh: "使用 Spark 将复杂批处理查询响应时间降低 40%，并通过 Hive 分区将时间序列查询效率提升 15%。",
      },
    ],
    technologies: ["Hadoop", "Hive", "Spark", "Flink", "Kafka"],
  },
  {
    id: "chat-gdufs",
    period: "Nov. 2024 - Dec. 2024",
    title: {
      en: "NLP Developer · ChatGDUFS Campus Q&A",
      zh: "NLP 开发者 · ChatGDUFS 校园问答系统",
    },
    organization: {
      en: "Campus services project",
      zh: "校园服务项目",
    },
    location: {
      en: "Guangzhou, China",
      zh: "中国广州",
    },
    bullets: [
      {
        en: "Built a LangChain RAG pipeline with Chroma and more than 2,000 documentation embeddings.",
        zh: "使用 LangChain、Chroma 与 2,000 多条文档向量构建 RAG 问答管线。",
      },
      {
        en: "Deployed a Flask query API averaging under two seconds for more than 100 daily queries.",
        zh: "部署 Flask 查询 API，日均处理 100 多次查询，平均响应低于 2 秒。",
      },
      {
        en: "Fine-tuned Qwen-7B with LoRA on 5,000 campus Q&A pairs, improving reported domain accuracy from 72% to 86%.",
        zh: "使用 5,000 组校园问答数据对 Qwen-7B 进行 LoRA 微调，报告领域准确率由 72% 提升至 86%。",
      },
      {
        en: "Added session-aware multi-turn dialogue across six conversation modes.",
        zh: "加入会话状态管理，支持六种对话模式下的上下文多轮交流。",
      },
    ],
    technologies: ["LangChain", "RAG", "Chroma", "Qwen-7B", "LoRA", "Flask"],
  },
];

export const skills = [
  {
    label: { en: "Programming", zh: "编程" },
    values: ["C++", "Java", "Python", "SQL", "Vue 3", "React", "JavaScript", "Git"],
  },
  {
    label: { en: "Frameworks & tools", zh: "框架与工具" },
    values: [
      "TensorFlow",
      "PyTorch",
      "MySQL",
      "Docker",
      "Redis",
      "Hadoop",
      "Spark",
      "Flink",
      "Kubernetes",
    ],
  },
  {
    label: { en: "Languages", zh: "语言" },
    values: [
      "English · IELTS 7",
      "Mandarin · Native",
      "Cantonese · Fluent",
    ],
  },
] satisfies Array<{ label: LocalizedText; values: string[] }>;

export const achievements: LocalizedText[] = [
  {
    en: "China International College Students' Innovation Competition - Outstanding Award, Jul. 2025.",
    zh: "中国国际大学生创新大赛 - 优秀奖，2025 年 7 月。",
  },
  {
    en: "14th Challenge Cup Guangdong College Students Entrepreneurship Competition - Bronze Award, Jul. 2024.",
    zh: "第十四届“挑战杯”广东大学生创业大赛 - 铜奖，2024 年 7 月。",
  },
  {
    en: "National College Students English Vocabulary Ability Competition - Third Prize (National), Jun. 2024.",
    zh: "全国大学生英语词汇能力大赛 - 全国三等奖，2024 年 6 月。",
  },
  {
    en: "Guangdong University of Foreign Studies - Third-Class Scholarship for Outstanding Students, Oct. 2023.",
    zh: "广东外语外贸大学优秀学生三等奖学金，2023 年 10 月。",
  },
  {
    en: "Guangdong Youth Science and Technology Innovation Competition - Silver Award, Oct. 2019.",
    zh: "广东省青少年科技创新大赛 - 银奖，2019 年 10 月。",
  },
];

export const publication: LocalizedText = {
  en: "Yang, H., Bai, J., He, C., Wang, Y., & Liang, W. (2024). Synthesis, characterization, and testing of rare earth-doped GdBO3 luminescent materials. Guangdong Chemical Industry, 51(10), 50-54.",
  zh: "Yang, H., Bai, J., He, C., Wang, Y., & Liang, W. (2024). 稀土掺杂 GdBO3 发光材料的合成、表征与测试。《广东化工》，51(10)，50-54。",
};
