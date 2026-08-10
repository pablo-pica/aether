import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const viewports = [
  { name: "phone", width: 320, height: 800 },
  { name: "tablet", width: 768, height: 900 },
  { name: "laptop", width: 1024, height: 900 },
  { name: "desktop", width: 1440, height: 1000 },
] as const;

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
  expect(overflow).toBe(false);
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
  expect(results.violations.filter((violation) => violation.impact === "critical" || violation.impact === "serious")).toEqual([]);
}

for (const viewport of viewports) {
  test(`${viewport.name}: Aid landing and app remain responsive`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: "Relief should arrive with proof." })).toBeVisible();
    await expect(page.locator('main a[href="/app"]').first()).toHaveAttribute("href", "/app");
    await expectNoHorizontalOverflow(page);

    await page.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });
    await expect(page.getByTestId("app-shell")).toBeVisible();
    await expect(page.getByRole("heading", { name: "How are you helping?" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Donor/ }).first()).toHaveAttribute("href", "/app/aid/donor");
    await expectNoHorizontalOverflow(page);

    if (viewport.width < 768) {
      await expect(page.getByRole("navigation", { name: "Mobile app navigation" })).toBeVisible();
    } else {
      await expect(page.getByRole("complementary", { name: "App sidebar" })).toBeVisible();
    }
  });
}

test("app routes are shareable and preserve every workspace", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });

  const routes = [
    ["/app/aid/donor", "Donor view"],
    ["/app/aid/coordinator", "Coordinator view"],
    ["/app/aid/merchant", "Merchant view"],
    ["/app/aid/verifier", "Verifier view"],
  ] as const;

  for (const [route, heading] of routes) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByRole("heading", { name: heading })).toBeVisible();
  }

  for (const route of ["/app/activity", "/app/settings", "/app/tools/send", "/app/tools/escrow"]) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    await expect(page.getByTestId("app-shell")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("keyboard entry and navigation expose visible destinations", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto(`${baseUrl}/app`, { waitUntil: "networkidle" });

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to workspace" })).toBeFocused();
  await expect(page.getByTestId("app-nav-send")).toHaveAttribute("href", "/app/tools/send");
  await expect(page.getByTestId("app-nav-escrow")).toHaveAttribute("href", "/app/tools/escrow");

  const startTab = page.getByRole("tab", { name: "Start here" });
  await startTab.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "Field guide" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "Field guide" })).toHaveAttribute("aria-selected", "true");
});

test("Aid role, guide choice, and mounted form state persist across app routes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${baseUrl}/app/aid/merchant`, { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Merchant view" })).toBeVisible();

  await page.getByRole("tab", { name: "Field guide" }).click();
  await page.getByRole("button", { name: "Live Testnet" }).click();
  await page.getByLabel("Campaign ID").fill("campaign-persistence-check");

  await page.getByTestId("app-nav-activity").click();
  await expect(page).toHaveURL(/\/app\/activity$/);
  await page.getByTestId("app-nav-aid").click();
  await expect(page).toHaveURL(/\/app$/);
  await expect(page.getByRole("heading", { name: "Merchant view" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Field guide" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Campaign ID")).toHaveValue("campaign-persistence-check");

  await page.reload({ waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: "Merchant view" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Field guide" })).toHaveAttribute("aria-selected", "true");
});

test("preview is deterministic, synchronized, and non-operational", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseUrl}/preview`, { waitUntil: "networkidle" });

  await expect(page.getByRole("heading", { name: "Synchronized desktop and phone" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Desktop preview frame" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Phone preview frame" })).toBeVisible();
  // Next.js injects a dev-tools button in development; exclude that framework chrome.
  await expect(page.locator('button:not([data-nextjs-dev-tools-button])')).toHaveCount(0);
  await expectNoHorizontalOverflow(page);

  await page.setViewportSize({ width: 768, height: 900 });
  await expect(page.getByRole("heading", { name: "Desktop-only preview" })).toBeVisible();
  await expectNoHorizontalOverflow(page);
});

test("critical public and app surfaces have no serious WCAG 2.1 AA violations", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  for (const route of ["/", "/app", "/preview"]) {
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
    await expectNoSeriousAccessibilityViolations(page);
  }
});
