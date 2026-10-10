import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { chooseLanguage } from "./test/language";
import { blogPosts } from "./data/blog";
import { locales } from "./i18n";

const articleHash = "#/blog/death-and-the-maiden";
const englishTitle = "Death & the Maiden: Beyond the Strings";
const chineseTitle = "Death & the Maiden｜弦外之音";

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
    const content = blogPosts[0].content[code];
    expect(document.documentElement.lang).toBe(tag);
    expect(new URLSearchParams(window.location.search).get("lang")).toBe(code);
    expect(window.location.hash).toBe(articleHash);
    expect(screen.getByRole("article")).toHaveAttribute("lang", tag);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(content.title);
    for (const paragraph of content.paragraphs) expect(screen.getByText(paragraph)).toBeInTheDocument();
    expect(screen.getByText(content.closing)).toBeInTheDocument();
    expect(screen.getByText(content.coverCaption)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: content.programmeAlt })).toBeInTheDocument();
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
    const content = blogPosts[0].content[code];
    expect(screen.getByRole("heading", { level: 2, name: content.title })).toBeInTheDocument();
    expect(screen.getByText(content.excerpt)).toBeInTheDocument();
  });

  it("requires complete, nonempty article content in every supported language", () => {
    for (const post of blogPosts) {
      expect(Object.keys(post.content).sort()).toEqual(locales.map(({ code }) => code).sort());
      for (const { code } of locales) {
        const content = post.content[code];
        expect(Object.keys(content).sort()).toEqual(Object.keys(post.content.en).sort());
        for (const value of Object.values(content)) {
          const strings = Array.isArray(value) ? value : [value];
          expect(strings.length).toBeGreaterThan(0);
          expect(strings.every((text) => typeof text === "string" && text.trim().length > 0)).toBe(true);
        }
        expect(content.paragraphs).toHaveLength(post.content.en.paragraphs.length);
        if (code !== "en") expect(content.paragraphs[0]).not.toBe(post.content.en.paragraphs[0]);
      }
    }
  });
});
