import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import {
  achievements,
  cvProjects,
  education,
  hsbcExperience,
  publication,
  research,
  skills,
  xinAnExperience,
} from "./data/cv";

function openPage(hash: string) {
  window.history.replaceState(null, "", hash);
  return render(<App />);
}

describe("complete CV experience", () => {
  it("gives HSBC a complete, prominent experience page", () => {
    openPage("#/experience");
    expect(screen.getByRole("heading", { name: /customer data, made actionable/i })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "HSBC" })).toHaveAttribute("src", "/hsbc-logo.png");
    expect(document.querySelectorAll('img[src="/hsbc-logo.png"]')).toHaveLength(1);
    expect(screen.getByText(hsbcExperience.title.en)).toBeInTheDocument();
    for (const contribution of hsbcExperience.bullets) {
      expect(screen.getByText(contribution.en)).toBeInTheDocument();
    }
    expect(screen.getByRole("link", { name: /open public cv/i })).toHaveAttribute("href", "/Hanyu_Yang_CV_Public.pdf");
  });

  it("preserves every original CV category on the dedicated CV page", () => {
    openPage("#/cv");
    for (const item of education) {
      expect(screen.getByText(item.institution.en)).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: item.degree.en })).toBeInTheDocument();
      for (const detail of item.details) expect(screen.getByText(detail.en)).toBeInTheDocument();
    }
    for (const entry of [xinAnExperience, ...research, ...cvProjects]) {
      expect(screen.getByRole("heading", { name: entry.title.en })).toBeInTheDocument();
      for (const bullet of entry.bullets) expect(screen.getByText(bullet.en)).toBeInTheDocument();
    }
    for (const achievement of achievements) expect(screen.getByText(achievement.en)).toBeInTheDocument();
    for (const group of skills) expect(screen.getByRole("heading", { name: group.label.en })).toBeInTheDocument();
    expect(screen.getByText(publication.en)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /download public cv/i })).toHaveAttribute("href", "/Hanyu_Yang_CV_Public.pdf");
  });

  it("shows the original research and publication on the research page", () => {
    openPage("#/research");
    expect(screen.getByRole("heading", { level: 1, name: "Research" })).toBeInTheDocument();
    for (const entry of research) {
      expect(screen.getByRole("heading", { name: entry.title.en })).toBeInTheDocument();
      for (const bullet of entry.bullets) expect(screen.getByText(bullet.en)).toBeInTheDocument();
    }
    expect(screen.getByText(publication.en)).toBeInTheDocument();
  });

  it("renders the complete HSBC experience in Chinese", () => {
    openPage("#/experience");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zh" } });
    expect(screen.getByRole("heading", { name: /让客户数据.*转化为行动/ })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "汇丰银行 HSBC" })).toHaveAttribute("src", "/hsbc-logo.png");
    for (const contribution of hsbcExperience.bullets) expect(screen.getByText(contribution.zh)).toBeInTheDocument();
  });

  it("renders the full archive and publication in Chinese", () => {
    openPage("#/cv");
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "zh" } });
    expect(screen.getByRole("heading", { name: /个人主页背后的完整经历/ })).toBeInTheDocument();
    expect(screen.getByText(publication.zh)).toBeInTheDocument();
    for (const entry of [xinAnExperience, ...research, ...cvProjects]) {
      expect(screen.getByRole("heading", { name: entry.title.zh })).toBeInTheDocument();
    }
  });

  it.each(["#/", "#/work", "#/research", "#/experience", "#/cv", "#/contact"])("does not expose private contact details on %s in either language", (hash) => {
    openPage(hash);
    for (const locale of ["en", "zh"]) {
      if (locale === "zh") fireEvent.change(screen.getByRole("combobox"), { target: { value: "zh" } });
      expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
      expect(document.querySelector('a[href^="tel:"]')).toBeNull();
      expect(document.body.textContent).not.toMatch(/\b1[3-9]\d{9}\b/);
      expect(document.body.textContent).not.toMatch(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i);
      expect(document.body.textContent).not.toMatch(/private address|home address/i);
    }
  });
});
