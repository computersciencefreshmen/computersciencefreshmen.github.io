import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const publicAsset = (name: string) =>
  resolve(process.cwd(), "public", name);

const pngSize = (name: string) => {
  const image = readFileSync(publicAsset(name));

  return {
    width: image.readUInt32BE(16),
    height: image.readUInt32BE(20),
  };
};

describe("personal brand assets", () => {
  it("keeps the master mark geometric and independent from installed fonts", () => {
    const mark = readFileSync(publicAsset("hy-mark-v2.svg"), "utf8");

    expect(mark).toContain('viewBox="0 0 64 64"');
    expect(mark).toContain("<path");
    expect(mark).not.toMatch(/<text\b/i);
    expect(mark).not.toContain("#db0011");
  });

  it.each([
    ["favicon-32-v2.png", 32, 32],
    ["apple-touch-icon-v2.png", 180, 180],
    ["icon-192-v2.png", 192, 192],
    ["icon-512-v2.png", 512, 512],
    ["icon-maskable-512-v2.png", 512, 512],
    ["og-card-v2.png", 1200, 630],
  ])("exports %s at %d × %d", (name, width, height) => {
    expect(pngSize(name)).toEqual({ width, height });
  });

  it("publishes both regular and maskable app icons", () => {
    const manifest = JSON.parse(
      readFileSync(publicAsset("site.webmanifest"), "utf8"),
    ) as {
      icons: Array<{ src: string; purpose: string }>;
    };

    expect(manifest.icons.some(({ purpose }) => purpose === "any")).toBe(true);
    expect(manifest.icons.some(({ purpose }) => purpose === "maskable")).toBe(
      true,
    );
  });
});
