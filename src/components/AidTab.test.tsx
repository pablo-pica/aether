import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("AidTab live/demo contract", () => {
  const source = () => fs.readFileSync(path.resolve(__dirname, "./AidTab.tsx"), "utf-8");

  it("keeps voucher availability reservation demo-only", () => {
    const content = source();
    expect(content).toContain("if (mode === \"demo\") {\n      if (amount > available)");
    expect(content).toContain("Contract validation determines live availability/state until read APIs are added");
  });

  it("requires explicit live operator inputs for non-derived Aid values", () => {
    const content = source();
    for (const label of [
      "Campaign ID",
      "Token address",
      "Merchant address",
      "Merchant profile hash",
      "Case ID",
      "Case record hash",
      "Voucher ID",
      "Purpose hash",
      "Funding amount",
      "Voucher amount",
      "Voucher category",
    ]) {
      expect(content).toContain(`aria-label=\"${label}\"`);
    }
    expect(content).toContain("Live mode requires merchant address and merchant profile hash.");
    expect(content).toContain("Live mode requires campaign ID, case ID, and case record hash.");
    expect(content).toContain("Live mode requires voucher ID, campaign ID, case ID, merchant address, and purpose hash.");
  });

  it("separates live campaign creation from funding existing campaigns", () => {
    const content = source();
    expect(content).toContain("const createLiveCampaign = () => run(\"Creating campaign\"");
    expect(content).toContain("Create live campaign");
    expect(content).toContain("const funded = await fundCampaign({ campaignId, amount: fundAmount });");
    expect(content).not.toContain("const create = await createCampaign");
  });
});
