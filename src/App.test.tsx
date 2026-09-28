import { chooseLanguage } from "./test/language";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";
import { projects } from "./data/portfolio";

function openPage(hash: string) {
  window.history.replaceState(null, "", hash);
  return render(<App />);
}

function expectProjectTitles(expected: typeof projects) {
  for (const project of projects) {
    const heading = screen.queryByRole("heading", { name: project.title });
    if (expected.includes(project)) expect(heading).toBeInTheDocument();
    else expect(heading).not.toBeInTheDocument();
  }
}

describe("portfolio navigation", () => {
  it("introduces the owner and three featured projects on the homepage", () => {
    render(<App />);
    const homeLink = screen.getByRole("link", { name: "Hanyu Yang — home" });
    const brandMark = homeLink.querySelector("img.brand-mark");

    expect(homeLink).toHaveAttribute("href", "#/");
    expect(brandMark).toHaveAttribute("src", "/hy-mark-v2.svg");
    expect(brandMark).toHaveAttribute("alt", "");
    expect(brandMark).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelectorAll('img[src="/hy-mark-v2.svg"]')).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hanyu Yang");
    expect(screen.getByRole("img", { name: "Portrait of Hanyu Yang" })).toHaveAttribute("src", "/profile.png");
    expectProjectTitles(projects.slice(0, 3));
    expect(within(screen.getByRole("navigation")).getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("opens the complete project collection from a direct URL", () => {
    openPage("#/work");
    expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
    expectProjectTitles(projects);
    expect(screen.getByRole("status")).toHaveTextContent("5 projects");
    expect(within(screen.getByRole("navigation")).getByRole("link", { name: "Selected work" })).toHaveAttribute("aria-current", "page");
  });

  it("navigates between pages and follows browser back and forward history", async () => {
    render(<App />);
    const navigation = within(screen.getByRole("navigation"));
    fireEvent.click(navigation.getByRole("link", { name: "Selected work" }));
    await screen.findByRole("heading", { level: 1, name: "Projects" });
    expect(window.location.hash).toBe("#/work");
    expect(screen.getByRole("main")).toHaveFocus();

    fireEvent.click(navigation.getByRole("link", { name: "Research" }));
    await screen.findByRole("heading", { level: 1, name: "Research" });
    expect(document.title).toBe("Hanyu Yang — Research");

    window.history.back();
    await screen.findByRole("heading", { level: 1, name: "Projects" });
    window.history.forward();
    await screen.findByRole("heading", { level: 1, name: "Research" });
    expect(navigation.getByRole("link", { name: "Research" })).toHaveAttribute("aria-current", "page");
  });

  it.each([
    ["#work", "Selected work"],
    ["#experience", "Experience"],
    ["#contact", "Contact"],
    ["#education", "Full CV"],
    ["#journey", "Full CV"],
    ["#about", "Home"],
    ["#/unknown-page", "Home"],
  ])("keeps existing or unknown links usable: %s", (hash, destination) => {
    openPage(hash);
    expect(within(screen.getByRole("navigation")).getByRole("link", { name: destination })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("main")).not.toBeEmptyDOMElement();
  });

  it("closes the menu on Escape, navigation, and language changes", async () => {
    render(<App />);
    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(menuButton);
    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(menuButton).toHaveFocus();

    fireEvent.click(menuButton);
    fireEvent.click(within(screen.getByRole("navigation")).getByRole("link", { name: "Selected work" }));
    await screen.findByRole("heading", { level: 1, name: "Projects" });
    expect(menuButton).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(menuButton);
    chooseLanguage("zh");
    expect(screen.getByRole("button", { name: "打开导航" })).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByRole("heading", { level: 1, name: "精选项目" })).toBeInTheDocument();
  });
});

describe("display preferences", () => {
  it("keeps the app and preference controls usable when storage is denied", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("Storage denied", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage denied", "SecurityError");
    });
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hanyu Yang");
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    chooseLanguage("zh");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("杨涵宇");
  });

  it("switches language and theme and restores both after revisiting", () => {
    const firstVisit = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Switch to dark theme" }));
    chooseLanguage("zh");

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("杨涵宇");
    expect(document.documentElement.lang).toBe("zh-CN");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(window.localStorage.getItem("hanyu-portfolio-theme")).toBe("dark");
    expect(new URLSearchParams(window.location.search).get("lang")).toBe("zh");

    firstVisit.unmount();
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("杨涵宇");
    fireEvent.click(screen.getByRole("button", { name: "切换到浅色主题" }));
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("hanyu-portfolio-theme")).toBe("light");
    chooseLanguage("en");
    expect(document.documentElement.lang).toBe("en");
    expect(document.title).toBe("Hanyu Yang — Software, Data & AI");
  });

  it("starts with the system theme until an explicit preference is saved", () => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    vi.mocked(window.matchMedia).mockReturnValue({ ...media, matches: true });
    const firstVisit = render(<App />);
    expect(document.documentElement.dataset.theme).toBe("dark");
    fireEvent.click(screen.getByRole("button", { name: "Switch to light theme" }));
    firstVisit.unmount();
    render(<App />);
    expect(document.documentElement.dataset.theme).toBe("light");
  });
});

describe("project discovery", () => {
  it("combines category and keyword filtering and recovers from an empty result", () => {
    openPage("#/work");
    const search = screen.getByRole("searchbox", { name: "Search projects" });
    fireEvent.click(screen.getByRole("button", { name: /^Products/ }));
    expect(screen.getByRole("status")).toHaveTextContent("4 projects");
    expect(screen.queryByRole("heading", { name: "YouTube Sentiment Analysis" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /^Research/ }));
    expect(screen.getByRole("status")).toHaveTextContent("1 project");
    expect(screen.getByRole("heading", { name: "YouTube Sentiment Analysis" })).toBeInTheDocument();
    fireEvent.change(search, { target: { value: "  bErT  " } });
    expect(screen.getByRole("status")).toHaveTextContent("1 project");
    fireEvent.change(search, { target: { value: "unmatched-query-987" } });
    expect(screen.getByRole("status")).toHaveTextContent("0 projects");
    expect(screen.getByRole("heading", { name: "No projects found" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show all projects" }));
    expect(search).toHaveValue("");
    expect(screen.getByRole("button", { name: /^All/ })).toHaveAttribute("aria-pressed", "true");
    expectProjectTitles(projects);
  });

  it("finds Chinese descriptions and keeps discovery controls localized", () => {
    openPage("#/work");
    chooseLanguage("zh");
    fireEvent.change(screen.getByRole("searchbox", { name: "搜索项目" }), { target: { value: "小票" } });
    expect(screen.getByRole("status")).toHaveTextContent("1 个项目");
    expect(screen.getByRole("heading", { name: "Japan Receipt Journal" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "清除筛选" }));
    expect(screen.getByRole("status")).toHaveTextContent("5 个项目");
  });
});

describe("public links", () => {
  it.each(["#/", "#/work", "#/research", "#/experience", "#/cv", "#/contact"])("keeps external destinations safe and accessible on %s", (hash) => {
    openPage(hash);
    const externalLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("target") === "_blank");
    expect(externalLinks.length).toBeGreaterThan(0);
    for (const link of externalLinks) {
      expect(link).toHaveAccessibleName();
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveAttribute("href", expect.stringMatching(/^(https:\/\/|\/Hanyu_Yang_CV_Public\.pdf$)/));
    }
  });

  it("keeps project link accessible names consistent with visible text in either language", () => {
    openPage("#/work");
    for (const language of ["en", "zh"]) {
      if (language === "zh") chooseLanguage("zh");
      for (const project of projects) {
        const sourceLabel = language === "zh" ? "查看源码" : "Source code";
        expect(screen.getByRole("link", { name: `${sourceLabel}: ${project.title}` })).toHaveTextContent(sourceLabel);
        if (project.liveUrl) {
          const liveLabel = language === "zh" ? "访问网站" : "Live site";
          expect(screen.getByRole("link", { name: `${liveLabel}: ${project.title}` })).toHaveTextContent(liveLabel);
        }
      }
    }
  });

  it("moves skip-link focus into the page without replacing its shareable URL", () => {
    openPage("#/work");
    fireEvent.click(screen.getByRole("link", { name: "Skip to content" }));
    expect(window.location.hash).toBe("#/work");
    expect(screen.getByRole("main")).toHaveFocus();
    expect(screen.getByRole("heading", { level: 1, name: "Projects" })).toBeInTheDocument();
  });
});
