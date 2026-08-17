import { expect, test } from "@playwright/test";

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

async function expectAccounting(page: import("@playwright/test").Page, values: { status: string; available: string; reserved: string; paid: string }) {
  const accounting = page.getByTestId("aid-card-accounting");
  await expect(accounting).toContainText(`Status: ${values.status}`);
  await expect(accounting).toContainText(values.available);
  await expect(accounting).toContainText(values.reserved);
  await expect(accounting).toContainText(values.paid);
}

test("clean and disputed local Aid walkthroughs expose their final accounting", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${baseUrl}/app/aid/coordinator`, { waitUntil: "networkidle" });

  await page.getByRole("button", { name: "Start clean walkthrough" }).click();
  await expect(page.getByText("Current: Issued. Next: Redeemed/evidence[0].")).toBeVisible();
  await page.getByRole("button", { name: "Advance walkthrough" }).click();
  await expect(page.getByText("Current: Redeemed/evidence[0]. Next: Paid (verifier approval)."))
    .toBeVisible();
  await page.getByRole("button", { name: "Advance walkthrough" }).click();
  await expectAccounting(page, { status: "paid", available: "75.00", reserved: "0.00", paid: "25.00" });
  await expect(page.getByText("Clean walkthrough complete.")).toBeVisible();

  await page.getByRole("button", { name: "Start disputed walkthrough" }).click();
  for (let step = 0; step < 4; step += 1) {
    await page.getByRole("button", { name: "Advance walkthrough" }).click();
  }
  await expectAccounting(page, { status: "rejected", available: "100.00", reserved: "0.00", paid: "0.00" });
  await expect(page.getByText("Disputed walkthrough complete.")).toBeVisible();
  await expect(page.getByTestId("aid-card-history")).toContainText("evidence[1] -> Rejected");
});
