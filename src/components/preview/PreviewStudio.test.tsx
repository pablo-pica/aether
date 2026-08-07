import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import fs from "fs";
import { fileURLToPath } from "url";

import PreviewStudio from "./PreviewStudio";

describe("PreviewStudio safety boundary", () => {
  it("renders identical deterministic desktop and phone frames", () => {
    const first = renderToStaticMarkup(<PreviewStudio />);
    const second = renderToStaticMarkup(<PreviewStudio />);

    expect(first).toBe(second);
    expect(first).toContain("Desktop preview frame");
    expect(first).toContain("Phone preview frame");
    expect(first).toContain("Same preview state");
  });

  it("contains no operational wallet, sponsor, or transaction seam", () => {
    const source = fs.readFileSync(fileURLToPath(import.meta.url).replace(/\.test\.tsx$/, ".tsx"), "utf-8");

    ["useStellarWallet", "/api/sponsor", "fetch(", "Math.random", "new Date", "<button", "<form"].forEach((unsafe) => {
      expect(source).not.toContain(unsafe);
    });
  });

  it("explains the desktop-only boundary on smaller screens", () => {
    const markup = renderToStaticMarkup(<PreviewStudio />);
    expect(markup).toContain("Desktop-only preview");
    expect(markup).toContain("1024px or wider");
    expect(markup).toContain("no transactions");
  });
});
