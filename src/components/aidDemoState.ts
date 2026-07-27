export type DemoStatus = "empty" | "funded" | "issued" | "redeemed" | "frozen" | "paid" | "rejected";
export type DemoClaimDecision = "Approve" | "Reject";
export type DemoAction =
  | { type: "reset" }
  | { type: "fund"; amount: number }
  | { type: "issue"; amount: number; category: string }
  | { type: "redeem" }
  | { type: "freeze" }
  | { type: "appendRevision" }
  | { type: "decide"; decision: DemoClaimDecision };

export interface DemoState {
  available: number;
  reserved: number;
  paid: number;
  status: DemoStatus;
  hasRevision: boolean;
  history: string[];
}

export const emptyDemoState = (): DemoState => ({
  available: 0,
  reserved: 0,
  paid: 0,
  status: "empty",
  hasRevision: false,
  history: [],
});

const withHistory = (state: DemoState, entry: string): DemoState => ({
  ...state,
  history: [entry, ...state.history].slice(0, 8),
});

export function applyDemoAction(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "reset":
      return emptyDemoState();
    case "fund": {
      if (!Number.isFinite(action.amount) || action.amount <= 0) throw new Error("Enter a positive funding amount.");
      return withHistory({ ...state, available: action.amount, reserved: 0, paid: 0, status: "funded", hasRevision: false }, "funded/issued ready");
    }
    case "issue": {
      if (!Number.isFinite(action.amount) || action.amount <= 0) throw new Error("Enter a positive voucher amount.");
      if (action.amount > state.available) throw new Error("Voucher amount exceeds available demo funds; reserved demo funds cannot be re-issued.");
      return withHistory({ ...state, available: state.available - action.amount, reserved: state.reserved + action.amount, status: "issued" }, "funded/issued -> voucher reserved");
    }
    case "redeem":
      if (state.status !== "issued") throw new Error("Demo voucher must be issued before merchant redemption.");
      return withHistory({ ...state, status: "redeemed" }, "Issued -> Redeemed/evidence[0]");
    case "freeze":
      if (state.status !== "redeemed") throw new Error("Only a redeemed demo claim can be frozen.");
      return withHistory({ ...state, status: "frozen" }, "Redeemed/evidence[0] -> Frozen (admin)");
    case "appendRevision":
      if (state.status !== "frozen") throw new Error("Evidence revision is allowed only after freeze.");
      if (state.hasRevision) throw new Error("Exactly one evidence revision is allowed in the demo and contract seam.");
      return withHistory({ ...state, hasRevision: true }, "Frozen -> evidence[1]");
    case "decide": {
      if (action.decision === "Approve" && state.status !== "redeemed") throw new Error("Clean demo approval requires redeemed evidence[0].");
      if (action.decision === "Reject" && state.status !== "frozen") throw new Error("Disputed demo rejection requires admin freeze and optional evidence[1].");
      const amount = state.reserved;
      if (action.decision === "Approve") {
        return withHistory({ ...state, reserved: 0, paid: state.paid + amount, status: "paid" }, "Redeemed/evidence[0] -> Paid (verifier approval); reserved -> paid");
      }
      return withHistory({ ...state, available: state.available + amount, reserved: 0, status: "rejected" }, "evidence[1] -> Rejected (verifier); reservation returns to available, no payout");
    }
  }
}

export const bootstrapIssuedDemo = (amount = 25): DemoState =>
  applyDemoAction(applyDemoAction(emptyDemoState(), { type: "fund", amount: 100 }), { type: "issue", amount, category: "Food" });
