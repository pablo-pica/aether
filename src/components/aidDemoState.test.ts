import { describe, expect, it } from "vitest";
import { applyDemoAction, bootstrapIssuedDemo, emptyDemoState } from "./aidDemoState";

describe("Aid guided demo state transitions", () => {
  it("executes clean walkthrough through issued, redeemed evidence[0], and paid accounting", () => {
    const issued = bootstrapIssuedDemo(25);
    expect(issued).toMatchObject({ available: 75, reserved: 25, paid: 0, status: "issued" });

    const redeemed = applyDemoAction(issued, { type: "redeem" });
    expect(redeemed).toMatchObject({ available: 75, reserved: 25, paid: 0, status: "redeemed" });

    const paid = applyDemoAction(redeemed, { type: "decide", decision: "Approve" });
    expect(paid).toMatchObject({ available: 75, reserved: 0, paid: 25, status: "paid" });
    expect(paid.history).toContain("Redeemed/evidence[0] -> Paid (verifier approval); reserved -> paid");
  });

  it("executes disputed walkthrough through freeze, evidence[1], rejection, and reservation release", () => {
    const issued = bootstrapIssuedDemo(25);
    const redeemed = applyDemoAction(issued, { type: "redeem" });
    const frozen = applyDemoAction(redeemed, { type: "freeze" });
    const revised = applyDemoAction(frozen, { type: "appendRevision" });
    const rejected = applyDemoAction(revised, { type: "decide", decision: "Reject" });

    expect(frozen.status).toBe("frozen");
    expect(revised.hasRevision).toBe(true);
    expect(rejected).toMatchObject({ available: 100, reserved: 0, paid: 0, status: "rejected" });
    expect(rejected.history).toContain("evidence[1] -> Rejected (verifier); reservation returns to available, no payout");
  });

  it("rejects shortcuts that skip required demo transitions", () => {
    expect(() => applyDemoAction(emptyDemoState(), { type: "redeem" })).toThrow("issued before merchant redemption");
    expect(() => applyDemoAction(bootstrapIssuedDemo(25), { type: "decide", decision: "Approve" })).toThrow("requires redeemed evidence[0]");
  });
});
