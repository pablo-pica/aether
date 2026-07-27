import { describe, expect, it } from "vitest";
import fs from "fs";
import path from "path";

describe("AidTab live/demo lifecycle contract", () => {
  const source = () => fs.readFileSync(path.resolve(__dirname, "./AidTab.tsx"), "utf-8");

  it("keeps deterministic local-demo accounting honest and outcome-visible", () => {
    const content = source();
    expect(content).toContain("Start clean walkthrough");
    expect(content).toContain("Start disputed walkthrough");
    expect(content).toContain("Advance walkthrough");
    expect(content).toContain("Current: {walkthroughCurrent}. Next: {walkthroughNext}");
    expect(content).toContain("History below records every validated transition");
    expect(content).toContain("never on-chain");
    expect(content).toContain("Visible state/history");
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
      "Initial evidence digest",
      "Evidence record ID",
      "Evidence revision digest",
      "Evidence revision record ID",
      "Freeze reason digest",
      "Verifier decision reason digest",
    ]) expect(content).toContain(`aria-label=\"${label}\"`);
    expect(content).toContain("role-disjoint wallets");
    expect(content).toContain("Pending submission:");
  });

  it("separates merchant, admin freeze, and verifier controls", () => {
    const content = source();
    expect(content).toContain("Merchant redemption workspace");
    expect(content).toContain("Admin emergency-freeze control");
    expect(content).toContain("Verifier-only review panel");
    expect(content).toContain("Freeze is an admin control, not a verifier decision.");
    expect(content).toContain("decide(ClaimDecision.Approve)");
    expect(content).toContain("decide(ClaimDecision.Reject)");
    expect(content).not.toContain("decide(ClaimDecision.Freeze)");
  });
});
