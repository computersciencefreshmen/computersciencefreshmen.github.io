export type Locale = "en" | "zh";

export interface LocalizedText {
  en: string;
  zh: string;
}

export interface Project {
  id: string;
  number: string;
  title: string;
  eyebrow: LocalizedText;
  description: LocalizedText;
  impact: LocalizedText;
  technologies: string[];
  repositoryUrl: string;
  liveUrl?: string;
  tone: "mint" | "amber" | "blue" | "rose" | "violet";
}

export interface JourneyItem {
  period: string;
  title: LocalizedText;
  organization: LocalizedText;
  description: LocalizedText;
}
