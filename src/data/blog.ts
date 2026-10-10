import type { Locale } from "../types";
import de from "./blog-locales/de.json";
import fr from "./blog-locales/fr.json";
import it from "./blog-locales/it.json";
import ru from "./blog-locales/ru.json";
import es from "./blog-locales/es.json";
import uk from "./blog-locales/uk.json";

export interface BlogContent {
  title: string;
  excerpt: string;
  paragraphs: string[];
  closing: string;
  venue: string;
  coverAlt: string;
  coverCaption: string;
  programmeAlt: string;
  programmeCaption: string;
  tags: string[];
}

export interface BlogPost {
  slug: string;
  author: string;
  publishedAt: string;
  concertDate: string;
  cover: string;
  programmeImage: string;
  programmeUrl: string;
  content: Record<Locale, BlogContent>;
}

// Every published essay must include every site locale. Type checking prevents
// silently showing English prose when a reader explicitly chooses another language.
export const blogPosts: BlogPost[] = [
  {
    slug: "death-and-the-maiden",
    author: "Hanyu Yang",
    publishedAt: "2026-10-10",
    concertDate: "2026-10-09",
    cover: "/blog/cuarteto-casals-stage.jpg",
    programmeImage: "/blog/cuarteto-casals-programme.jpg",
    programmeUrl: "https://muse.hku.hk/highlights/hku-muse-2026-27-season-preview/",
    content: {
      de, fr, it, ru, es, uk,
      en: {
        title: "Death & the Maiden: Beyond the Strings",
        excerpt: "An evening with Cuarteto Casals at HKU: from Schubert’s dark intensity to the quiet consolation of birdsong.",
        paragraphs: [
          "October’s heat was beginning to loosen its hold on Hong Kong. That evening, at HKU’s Grand Hall, I heard the Spanish Cuarteto Casals in their Hong Kong debut. The programme moved from the finely woven counterpoint of Haydn’s Op. 20 No. 5, through the Asian premiere of Elisenda Fábregas’s Fiery Earth, to Schubert’s Death and the Maiden. In D minor, the four string instruments wove around one another again and again. Surges of intensity gave way to hushed passages, each layer deepening a tension that felt almost suffocating in its darkness.",
          "The encores came as an unexpected gift: from the blazing abandon of Manuel de Falla’s Danza del molinero to the distant, quiet song of Pablo Casals’s Song of the Birds. This old Catalan melody carries a longing for home and a hope for peace. Having just faced Schubert’s gaze into death, we finally came to rest in the stillness of birdsong.",
        ],
        closing: "The music ended, and the audience dispersed. The strings still lingered.",
        venue: "HKU Grand Hall · Hong Kong",
        coverAlt: "The four musicians of Cuarteto Casals taking a bow with their instruments at the HKU Grand Hall.",
        coverCaption: "Cuarteto Casals at the HKU Grand Hall, 9 October 2026.",
        programmeAlt: "The Cuarteto Casals Hong Kong debut programme held in front of the warmly lit HKU Grand Hall stage.",
        programmeCaption: "Before the first note. The evening’s programme at the Grand Hall.",
        tags: ["HKU MUSE", "Cuarteto Casals", "Classical music", "Chamber music", "Hong Kong"],
      },
      zh: {
        title: "Death & the Maiden｜弦外之音",
        excerpt: "在港大 Grand Hall 听 Cuarteto Casals 香港首演，从舒伯特的幽暗张力，到飞鸟歌声中的宁静。",
        paragraphs: [
          "十月的香港暑气渐散，晚上在港大 Grand Hall 听西班牙 Cuarteto Casals 的香港首演，从 Haydn Op. 20 No. 5 精巧的复调，到 Elisenda Fábregas《Fiery Earth》的亚洲首演，最后到 Schubert《Death and the Maiden》。四把弦乐器在 D 小调里反复交织，激越与低回层层递进，阴郁中透着近乎窒息的张力。",
          "Encore 完全是意料之外，从 Manuel de Falla《Danza del molinero》的炽热奔放，转入 Pablo Casals 的《Song of the Birds》的悠远低吟。这支来自加泰罗尼亚的古老旋律，承载着故土与和平的寄托。刚经历完 Schubert 对死亡的凝视，最后却在飞鸟的歌声中归于宁静。",
        ],
        closing: "曲终人散，弦音未绝。",
        venue: "香港大学 Grand Hall · 香港",
        coverAlt: "Cuarteto Casals 四位音乐家手持弦乐器，在香港大学 Grand Hall 谢幕。",
        coverCaption: "Cuarteto Casals 于香港大学 Grand Hall，2026 年 10 月 9 日。",
        programmeAlt: "手中的 Cuarteto Casals 香港首演节目单，背景是暖色灯光下的港大 Grand Hall 舞台。",
        programmeCaption: "第一声弦音之前，Grand Hall 里的音乐会节目单。",
        tags: ["HKU MUSE", "Cuarteto Casals", "古典音乐", "室内乐", "香港"],
      },
    },
  },
];

export function getBlogPost(slug: string | undefined): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(date: string, locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : locale, {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}
