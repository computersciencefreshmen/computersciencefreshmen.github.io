import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { chooseLanguage } from "./test/language";

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

describe("bilingual blog", () => {
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

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    expect(screen.getByRole("heading", { level: 1, name: englishTitle })).toBeInTheDocument();
    expect(new URLSearchParams(window.location.search).get("lang")).toBe("en");
    expect(window.location.hash).toBe(articleHash);
    expect(screen.getByRole("article")).toHaveAttribute("lang", "en");

    fireEvent.click(screen.getByRole("button", { name: "中文" }));
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
      fireEvent.click(screen.getByRole("button", { name: "中文" }));
      expect(document.title).toContain(chineseTitle);
      expect(description.content).not.toBe(englishDescription);
      expect(description.content).toMatch(/[\u4e00-\u9fff]/);
    } finally {
      description.remove();
    }
  });

  it("uses the English article fallback while preserving a different interface language", () => {
    openBlog();
    chooseLanguage("fr");
    expect(document.documentElement.lang).toBe("fr");
    expect(screen.getByRole("combobox")).toHaveAttribute("data-value", "fr");
    expect(new URLSearchParams(window.location.search).get("lang")).toBe("fr");
    expect(window.location.hash).toBe(articleHash);
    expect(screen.getByRole("article")).toHaveAttribute("lang", "en");
    expect(screen.getByRole("heading", { level: 1, name: englishTitle })).toBeInTheDocument();
  });
});
