import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { chooseLanguage } from "./test/language";
import { blogPosts, getBlogPost } from "./data/blog";
import { locales } from "./i18n";

const articleHash = "#/blog/death-and-the-maiden";
const travelHash = "#/blog/between-tides-and-twilight";
const englishTitle = "Death & the Maiden: Beyond the Strings";
const chineseTitle = "Death & the Maiden｜弦外之音";
const concertPost = getBlogPost("death-and-the-maiden")!;
const travelPost = getBlogPost("between-tides-and-twilight")!;

function openBlog(url = articleHash) {
  window.history.replaceState(null, "", url);
  return render(<App />);
}

function mainLinkTo(hash: string) {
  const link = within(screen.getByRole("main")).getAllByRole("link")
    .find((item) => item.getAttribute("href") === hash);
  expect(link).toBeDefined();
  return link!;
}

function chooseArticleLanguage(code: string) {
  const picker = within(document.querySelector<HTMLElement>(".blog-language")!);
  fireEvent.click(picker.getByRole("combobox"));
  fireEvent.click(picker.getByRole("option", { name: locales.find((locale) => locale.code === code)!.name }));
}

describe("multilingual blog", () => {
  it("opens a shared article in English despite old preferences and includes both photographs", () => {
    window.localStorage.setItem("hanyu-portfolio-locale", "zh");
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["zh-CN"]);
    openBlog();

    expect(screen.getByRole("heading", { level: 1, name: englishTitle })).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveAttribute("lang", "en");
    expect(document.documentElement.lang).toBe("en");
    expect(within(screen.getByRole("navigation")).getByRole("link", { name: "Blog" }))
      .toHaveAttribute("aria-current", "page");
    const photographs = within(screen.getByRole("article")).getAllByRole("img");
    for (const source of ["/blog/cuarteto-casals-stage.jpg", "/blog/cuarteto-casals-programme.jpg"]) {
      const photograph = photographs.find((item) => item.getAttribute("src") === source);
      expect(photograph).toBeDefined();
      expect(photograph).toHaveAccessibleName();
    }
  });

  it("honors Chinese links and lets readers switch article languages without losing its URL", () => {
    const firstVisit = openBlog(`?lang=zh${articleHash}`);
    expect(screen.getByRole("heading", { level: 1, name: chineseTitle })).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveAttribute("lang", "zh-CN");

    chooseArticleLanguage("en");
    expect(screen.getByRole("heading", { level: 1, name: englishTitle })).toBeInTheDocument();
    expect(new URLSearchParams(window.location.search).get("lang")).toBe("en");
    expect(window.location.hash).toBe(articleHash);
    expect(screen.getByRole("article")).toHaveAttribute("lang", "en");

    chooseArticleLanguage("zh");
    expect(screen.getByRole("heading", { level: 1, name: chineseTitle })).toBeInTheDocument();
    expect(new URLSearchParams(window.location.search).get("lang")).toBe("zh");
    expect(window.location.hash).toBe(articleHash);
    firstVisit.unmount();
    render(<App />);
    expect(screen.getByRole("article")).toHaveAttribute("lang", "zh-CN");
    expect(screen.getByRole("heading", { level: 1, name: chineseTitle })).toBeInTheDocument();
  });

  it("opens articles from the blog and supports browser history and the return link", async () => {
    openBlog("#/blog");
    expect(screen.getByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument();
    const articleLink = mainLinkTo(articleHash);
    expect(articleLink).toHaveAccessibleName();
    fireEvent.click(articleLink);
    await screen.findByRole("heading", { level: 1, name: englishTitle });
    expect(window.location.hash).toBe(articleHash);
    expect(screen.getByRole("main")).toHaveFocus();

    window.history.back();
    await screen.findByRole("heading", { level: 1, name: "Blog" });
    window.history.forward();
    await screen.findByRole("heading", { level: 1, name: englishTitle });
    fireEvent.click(mainLinkTo("#/blog"));
    await screen.findByRole("heading", { level: 1, name: "Blog" });
    expect(window.location.hash).toBe("#/blog");
  });

  it("provides a usable path back to the blog for an unknown article", async () => {
    openBlog("#/blog/missing-entry");
    expect(screen.getByRole("main")).not.toBeEmptyDOMElement();
    expect(screen.queryByRole("heading", { level: 1, name: englishTitle })).not.toBeInTheDocument();
    const recovery = mainLinkTo("#/blog");
    expect(recovery).toHaveAccessibleName();
    fireEvent.click(recovery);
    await screen.findByRole("heading", { level: 1, name: "Blog" });
  });

  it("updates article title and description metadata when its language changes", () => {
    const description = document.createElement("meta");
    description.name = "description";
    document.head.append(description);
    try {
      openBlog();
      expect(document.title).toContain(englishTitle);
      expect(description.content).toMatch(/Cuarteto Casals/);
      const englishDescription = description.content;
      chooseArticleLanguage("zh");
      expect(document.title).toContain(chineseTitle);
      expect(description.content).not.toBe(englishDescription);
      expect(description.content).toMatch(/[\u4e00-\u9fff]/);
    } finally {
      description.remove();
    }
  });

  it.each(locales)("opens complete $name prose and synchronizes both language selectors", ({ code, tag }) => {
    const view = openBlog(`?lang=${code}${articleHash}`);
    const content = concertPost.content[code];
    expect(document.documentElement.lang).toBe(tag);
    expect(new URLSearchParams(window.location.search).get("lang")).toBe(code);
    expect(window.location.hash).toBe(articleHash);
    expect(screen.getByRole("article")).toHaveAttribute("lang", tag);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(content.title);
    for (const paragraph of content.paragraphs) expect(screen.getByText(paragraph)).toBeInTheDocument();
    expect(screen.getByText(content.closing)).toBeInTheDocument();
    expect(screen.getByText(content.coverCaption)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: content.gallery[0].alt })).toBeInTheDocument();
    expect(document.title).toContain(content.title);
    for (const selector of screen.getAllByRole("combobox")) expect(selector).toHaveAttribute("data-value", code);
    const articlePicker = within(document.querySelector<HTMLElement>(".blog-language")!);
    fireEvent.click(articlePicker.getByRole("combobox"));
    expect(articlePicker.getAllByRole("option")).toHaveLength(8);
    fireEvent.keyDown(articlePicker.getByRole("combobox"), { key: "Escape" });
    chooseLanguage("en");
    chooseArticleLanguage(code);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(content.title);
    expect(window.location.hash).toBe(articleHash);
    view.unmount();
    render(<App />);
    expect(screen.getByRole("article")).toHaveAttribute("lang", tag);
    expect(screen.getByText(content.paragraphs[0])).toBeInTheDocument();
  });

  it.each(locales)("shows translated $name titles and excerpts in the blog list", ({ code }) => {
    openBlog(`?lang=${code}#/blog`);
    const list = within(document.querySelector<HTMLElement>(".blog-list")!);
    expect(list.getAllByRole("article")).toHaveLength(2);
    expect(list.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent))
      .toEqual([travelPost.content[code].title, concertPost.content[code].title]);
    for (const post of [travelPost, concertPost]) {
      expect(list.getByRole("heading", { level: 2, name: post.content[code].title })).toBeInTheDocument();
      expect(list.getByText(post.content[code].excerpt)).toBeInTheDocument();
    }
  });

  it.each(locales)("opens the full $name October 11 travel story with all five photographs", ({ code, tag }) => {
    const description = document.createElement("meta");
    description.name = "description";
    document.head.append(description);
    try {
      openBlog(`?lang=${code}${travelHash}`);
      const content = travelPost.content[code];
      const article = screen.getByRole("article");
      expect(article).toHaveAttribute("lang", tag);
      expect(document.documentElement.lang).toBe(tag);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(content.title);
      expect(document.title).toContain(content.title);
      expect(description.content).toBe(content.excerpt);
      for (const paragraph of content.paragraphs) expect(screen.getByText(paragraph)).toBeInTheDocument();
      expect(screen.getByText(content.closing)).toBeInTheDocument();
      expect(within(article).getAllByRole("img").map((photo) => photo.getAttribute("src")))
        .toEqual([
          "/blog/between-tides-and-twilight/victoria-harbour-sunset.webp",
          "/blog/between-tides-and-twilight/peel-street-evening.webp",
          "/blog/between-tides-and-twilight/victoria-park-star-lanterns.webp",
          "/blog/between-tides-and-twilight/hong-kong-island-night.webp",
          "/blog/between-tides-and-twilight/happy-valley-racing.webp",
        ]);
      expect(screen.getByRole("img", { name: content.coverAlt })).toHaveAccessibleName();
      expect(screen.getByText(content.coverCaption)).toBeInTheDocument();
      for (const photo of content.gallery) {
        expect(screen.getByRole("img", { name: photo.alt })).toHaveAccessibleName();
        expect(screen.getByText(photo.caption)).toBeInTheDocument();
      }
      expect(article.querySelector('time[datetime="2026-10-11"]')).toBeInTheDocument();
      expect(article.querySelector('time[datetime="2026-10-09"]')).not.toBeInTheDocument();
      expect(within(article).queryByRole("link", { name: "HKU MUSE" })).not.toBeInTheDocument();
      for (const selector of screen.getAllByRole("combobox")) expect(selector).toHaveAttribute("data-value", code);
      chooseArticleLanguage(code === "en" ? "zh" : "en");
      expect(window.location.hash).toBe(travelHash);
      chooseLanguage(code);
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(content.title);
    } finally {
      description.remove();
    }
  });

  it("keeps the supplied Chinese travel prose and publication date", () => {
    openBlog(`?lang=zh${travelHash}`);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("浮光入夜");
    expect(screen.getByText("夏去秋来，从深圳回港恰好赶上维港的日落，在星光大道上漫步，远处红帆缓缓驶过，晚霞将天际染成橘红，海面浮光跃金，港岛星星点点的灯火，从中环码头向半山蔓延，暮色渐沉，一轮明月悄然升起。")).toBeInTheDocument();
    expect(screen.getByText("风起时，愿君如燕入高林；潮落后，望我似舟归远岸。")).toBeInTheDocument();
    expect(travelPost.publishedAt).toBe("2026-10-11");
  });

  it("defaults a shared travel link to English and retains its language after refreshing", () => {
    window.localStorage.setItem("hanyu-portfolio-locale", "uk");
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["uk"]);
    const view = openBlog(travelHash);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Between Tides and Twilight");
    expect(screen.getByRole("article")).toHaveAttribute("lang", "en");
    chooseArticleLanguage("de");
    expect(window.location.hash).toBe(travelHash);
    view.unmount();
    render(<App />);
    expect(screen.getByRole("article")).toHaveAttribute("lang", "de");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(travelPost.content.de.title);
    for (const selector of screen.getAllByRole("combobox")) expect(selector).toHaveAttribute("data-value", "de");
  });

  it("promotes the October 11 story as the latest writing on the homepage", () => {
    openBlog("#/");
    const latest = within(document.querySelector<HTMLElement>(".home-blog")!);
    expect(latest.getAllByRole("article")).toHaveLength(1);
    expect(latest.getByRole("heading", { level: 2, name: "Between Tides and Twilight" })).toBeInTheDocument();
    expect(document.querySelector(".home-blog .blog-card__image img")).toHaveAttribute("src", travelPost.cover);
    expect(latest.queryByRole("heading", { name: englishTitle })).not.toBeInTheDocument();
    const link = latest.getByRole("link", { name: "Read story" });
    expect(link).toHaveAttribute("href", travelHash);
  });

  it("preserves the concert source and event date after generalizing the gallery", () => {
    openBlog();
    const article = screen.getByRole("article");
    expect(within(article).getAllByRole("img")).toHaveLength(2);
    expect(article.querySelector('time[datetime="2026-10-09"]')).toBeInTheDocument();
    expect(within(article).getByRole("link", { name: "HKU MUSE" }))
      .toHaveAttribute("href", "https://muse.hku.hk/highlights/hku-muse-2026-27-season-preview/");
  });

  it("requires complete, nonempty article content in every supported language", () => {
    for (const post of blogPosts) {
      expect(Object.keys(post.content).sort()).toEqual(locales.map(({ code }) => code).sort());
      for (const { code } of locales) {
        const content = post.content[code];
        expect(Object.keys(content).sort()).toEqual(Object.keys(post.content.en).sort());
        for (const [key, value] of Object.entries(content)) {
          if (key === "gallery") continue;
          const strings = Array.isArray(value) ? value : [value];
          expect(strings.length).toBeGreaterThan(0);
          expect(strings.every((text) => typeof text === "string" && text.trim().length > 0)).toBe(true);
        }
        expect(content.gallery).toHaveLength(post.gallery.length);
        for (const photo of content.gallery) {
          expect(Object.keys(photo).sort()).toEqual(["alt", "caption"]);
          expect(photo.alt.trim()).not.toHaveLength(0);
          expect(photo.caption.trim()).not.toHaveLength(0);
        }
        expect(content.paragraphs).toHaveLength(post.content.en.paragraphs.length);
        if (code !== "en") expect(content.paragraphs[0]).not.toBe(post.content.en.paragraphs[0]);
      }
    }
  });
});
