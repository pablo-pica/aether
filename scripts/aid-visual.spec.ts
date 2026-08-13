import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const roles = ["donor", "coordinator", "merchant", "verifier"] as const;
const viewports = [
  { name: "desktop", width: 1280, height: 900 },
  { name: "mobile", width: 390, height: 844 },
] as const;

for (const role of roles) {
  for (const viewport of viewports) {
    test(`${role} Aid workspace remains visually stable at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(`${baseUrl}/app/aid/${role}`, { waitUntil: "networkidle" });

      await expect(page.getByTestId("aid-workspace-cards")).toBeVisible();
      await expect(page.locator("main")).toHaveScreenshot(`${role}-${viewport.name}.png`, {
        animations: "disabled",
        caret: "hide",
        scale: "css",
      });
    });
  }
}
