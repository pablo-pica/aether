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
    expect(content).toContain("admin and verifier authorities must be separate");
    expect(content).toContain("a verifier cannot approve their own merchant claim");
    expect(content).toContain("Pending submission:");
    expect(content).toContain("Add AIDT Testnet trustline");
    expect(content).toContain("isMockWallet");
    expect(content).toContain("Connect a real Testnet role wallet before submitting.");
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

  it("uses the app's shared tab primitives and accessible field treatment", () => {
    const content = source();
    expect(content).toContain('import SegmentedControl from "./ui/SegmentedControl"');
    expect(content).toContain('className="space-y-6" data-testid="aid-tab-root"');
    expect(content).toContain('className={surfaceCardClassName}');
    expect(content).not.toContain("glass-card");
    expect(content).not.toContain("bg-space-950/40");
    expect(content).toContain("focus-ring");
    expect(content).toContain('idPrefix="aid-mode"');
    expect(content).toContain('aria-live="polite"');
    expect(content).toContain('const formActionButtonClassName = "h-11 w-full rounded-full');
    expect(content).toContain('const formAmberActionButtonClassName = "h-11 w-full rounded-full');
    expect(content).toContain('const formCyanActionButtonClassName = "h-11 w-full rounded-full');
    expect(content).toContain('const redActionButtonClassName = "ml-auto h-9 w-fit rounded-full');
    expect(content).toContain('onClick={() => decide(ClaimDecision.Approve)} className={primaryButtonClassName}');
    expect(content).toContain('onClick={fund} className={formActionButtonClassName}');
    expect(content).toContain('className="grid grid-cols-1 gap-2 sm:grid-cols-2"><button type="button" onClick={() => startWalkthrough("clean")} disabled={!!pending} className={formActionButtonClassName}');
  });
});
