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
} from "./data/cv";

describe("complete CV experience", () => {
  it("gives HSBC a complete, prominent casefile", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: /customer data, made actionable/i }),
    ).toBeInTheDocument();
    const hsbcLogo = screen.getByRole("img", { name: "HSBC" });
    expect(hsbcLogo).toHaveAttribute("src", "/hsbc-logo.png");
    expect(
      document.querySelectorAll('img[src="/hsbc-logo.png"]'),
    ).toHaveLength(1);

    expect(
      screen.getByText(/CRM Data Analyst Intern · Wealth and Personal Banking/i),
    ).toBeInTheDocument();

    for (const contribution of hsbcExperience.bullets) {
      expect(screen.getByText(contribution.en)).toBeInTheDocument();
    }

    expect(
      screen.getByRole("link", { name: /open public cv/i }),
    ).toHaveAttribute("href", "/Hanyu_Yang_CV_Public.pdf");
  });

  it("shows every professional CV category without hiding entries", () => {
    render(<App />);

    for (const item of education) {
      expect(screen.getByText(item.institution.en)).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: item.degree.en }),
      ).toBeInTheDocument();
    }

    for (const entry of [...research, ...cvProjects]) {
      expect(
        screen.getByRole("heading", { name: entry.title.en }),
      ).toBeInTheDocument();
    }

    for (const achievement of achievements) {
      expect(screen.getByText(achievement.en)).toBeInTheDocument();
    }

    expect(screen.getByText(publication.en)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /AI Development Intern/i }),
    ).toBeInTheDocument();
  });

  it("renders the HSBC casefile and full archive in Chinese", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "切换到中文" }));

    expect(
      screen.getByRole("heading", { name: /让客户数据.*转化为行动/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "汇丰银行 HSBC" }),
    ).toHaveAttribute("src", "/hsbc-logo.png");
    expect(
      screen.getByRole("heading", { name: /个人主页背后的完整经历/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(publication.zh)).toBeInTheDocument();
  });

  it("does not expose private contact details in the public page", () => {
    render(<App />);

    expect(document.querySelector('a[href^="mailto:"]')).toBeNull();
    expect(document.querySelector('a[href^="tel:"]')).toBeNull();
    expect(document.body.textContent).not.toMatch(/\b1[3-9]\d{9}\b/);
    expect(document.body.textContent).not.toMatch(
      /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    );
    expect(document.body.textContent).not.toMatch(
      /private address|home address/i,
    );
  });
});
