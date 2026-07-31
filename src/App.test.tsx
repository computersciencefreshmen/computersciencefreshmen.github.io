import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "./App";
import { projects } from "./data/portfolio";

describe("portfolio", () => {
  it("presents the primary identity, navigation, and all selected projects", () => {
    render(<App />);

    const homeLink = screen.getByRole("link", {
      name: /Hanyu Yang — home/i,
    });
    const brandMark = homeLink.querySelector("img.brand-mark");

    expect(homeLink).toBeInTheDocument();
    expect(brandMark).toHaveAttribute("src", "/hy-mark-v2.svg");
    expect(brandMark).toHaveAttribute("alt", "");
    expect(brandMark).toHaveAttribute("aria-hidden", "true");
    expect(document.querySelectorAll('img[src="/hy-mark-v2.svg"]')).toHaveLength(
      2,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /real-world questions/i,
    );
    expect(screen.getByRole("navigation", { name: /primary/i })).toBeInTheDocument();

    for (const project of projects) {
      expect(
        screen.getByRole("heading", { name: project.title }),
      ).toBeInTheDocument();
    }
  });

  it("switches the complete interface language to Chinese", () => {
    render(<App />);

    fireEvent.click(
      screen.getByRole("button", { name: "切换到中文" }),
    );

    expect(screen.getByRole("link", { name: "精选项目" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /真实世界问题/,
    );
    expect(document.documentElement.lang).toBe("zh-CN");
  });

  it("keeps external destinations safe and accessible", () => {
    render(<App />);

    const externalLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("target") === "_blank");

    expect(externalLinks.length).toBeGreaterThan(5);

    for (const link of externalLinks) {
      expect(link).toHaveAttribute("rel", "noreferrer");
      expect(link).toHaveAttribute(
        "href",
        expect.stringMatching(/^(https:\/\/|\/Hanyu_Yang_CV_Public\.pdf$)/),
      );
    }
  });
});
