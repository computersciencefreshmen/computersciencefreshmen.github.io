import { chooseLanguage } from "../test/language";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "../App";
import { education, hsbcExperience, research, cvProjects, xinAnExperience, achievements } from "../data/cv";
import { projects } from "../data/portfolio";
import { dictionaries, formatPeriod, locales, normalizeLocale, translate } from ".";
import source from "./source.json";

describe("translation completeness", () => {
  it.each(locales.filter(item => item.code !== "en" && item.code !== "zh"))("ships every source message in $name", ({ code }) => {
    const dictionary = dictionaries[code as keyof typeof dictionaries];
    expect(Object.keys(dictionary).sort()).toEqual(Object.keys(source).sort());
    expect(Object.values(dictionary).every(value => typeof value === "string" && value.trim().length > 0)).toBe(true);
  });

  it("includes every public profile record in the translation catalog", () => {
    function check(value: unknown) {
      if (!value || typeof value !== "object") return;
      if ("en" in value && "zh" in value && typeof value.en === "string") {
        if (value.en === "HSBC") return; // Official brand spelling in every Latin/Cyrillic locale.
        expect(Object.hasOwn(source, value.en), value.en).toBe(true);
      } else Object.values(value).forEach(check);
    }
    [education, hsbcExperience, research, cvProjects, xinAnExperience, achievements, projects].forEach(check);
  });
});

describe("multilingual navigation", () => {
  it.each(locales)("changes all pages and restores $name", ({ code, tag }) => {
    const view = render(<App />);
    chooseLanguage(code);
    expect(document.documentElement.lang).toBe(tag);
    expect(new URLSearchParams(window.location.search).get("lang")).toBe(code);
    expect(screen.getByRole("combobox")).toHaveAccessibleName(translate(code, "Choose language"));
    view.unmount();
    window.history.replaceState(null, "", `?lang=${code}#/research`);
    const researchView = render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(translate(code, "Research"));
    expect(document.title).toContain(translate(code, "Research"));
    expect(screen.getByText(translate(code, research[0].bullets[0].en))).toBeInTheDocument();
    researchView.unmount();
    window.history.replaceState(null, "", `?lang=${code}#/cv`);
    render(<App />);
    expect(screen.getByText(translate(code, cvProjects[0].bullets[0].en))).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(translate(code, "Download public CV")) })).toHaveAttribute("href", "/Hanyu_Yang_CV_Public.pdf");
  });

  it("accepts UA aliases and gives explicit URL language precedence over saved preference", () => {
    window.localStorage.setItem("hanyu-portfolio-locale", "fr");
    window.history.replaceState(null, "", "?lang=ua#/contact");
    render(<App />);
    expect(document.documentElement.lang).toBe("uk");
    expect(screen.getByRole("combobox")).toHaveAttribute("data-value", "uk");
    expect(window.location.hash).toBe("#/contact");
  });

  it("starts in English even with a non-English browser and an old saved preference", () => {
    window.localStorage.setItem("hanyu-portfolio-locale", "zh");
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["zh-CN", "fr-CA"]);
    render(<App />);
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("combobox")).toHaveAttribute("data-value", "en");
  });

  it("starts in English when storage is blocked and still allows language changes", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => { throw new Error("blocked"); });
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["ja-JP", "fr-CA", "de-DE"]);
    render(<App />);
    expect(document.documentElement.lang).toBe("en");
    chooseLanguage("ru");
    expect(document.documentElement.lang).toBe("ru");
  });

  it("matches translated project descriptions, including unaccented search", () => {
    window.history.replaceState(null, "", "?lang=fr#/work");
    render(<App />);
    const term = translate("fr", projects[0].eyebrow.en).split(" · ")[0].normalize("NFKD").replace(/\p{M}/gu, "");
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: term } });
    expect(screen.getByRole("heading", { name: "StudyInChina" })).toBeInTheDocument();
    expect(document.querySelectorAll(".project-card").length).toBeLessThan(projects.length);
    fireEvent.change(screen.getByRole("searchbox"), { target: { value: translate("fr", "Product design") } });
    expect(screen.getByRole("heading", { name: "StudyInChina" })).toBeInTheDocument();
  });

  it("restores the URL language on browser history navigation", () => {
    window.history.replaceState(null, "", "?lang=en#/work");
    render(<App />);
    chooseLanguage("fr");
    window.history.replaceState(null, "", "/#/work");
    fireEvent.popState(window);
    expect(screen.getByRole("combobox")).toHaveAttribute("data-value", "en");
    expect(document.documentElement.lang).toBe("en");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Projects");
  });

  it("supports keyboard selection and restores focus after Escape", () => {
    render(<App />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(trigger, { key: "End" });
    fireEvent.keyDown(trigger, { key: "Enter" });
    expect(document.documentElement.lang).toBe("uk");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: "Escape" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(trigger).toHaveFocus();
  });

  it("closes the language menu on outside interaction", () => {
    render(<App />);
    const trigger = screen.getByRole("combobox");
    fireEvent.click(trigger);
    fireEvent.pointerDown(document.body);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    expect(document.documentElement.lang).toBe("en");
  });

  it("normalizes regional tags and formats localized CV dates", () => {
    expect(normalizeLocale("UK-ua")).toBe("uk");
    expect(normalizeLocale("de_DE")).toBe("de");
    expect(normalizeLocale("unknown")).toBeUndefined();
    expect(formatPeriod("Sept. 2026 - Aug. 2027 (Expected)", "de")).toContain(translate("de", "Expected"));
    expect(formatPeriod("Mar. 2026 - Jul. 2026", "ru")).not.toContain("Mar.");
  });
});
