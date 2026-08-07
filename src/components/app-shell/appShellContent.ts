export type AidRole = "donor" | "coordinator" | "merchant" | "verifier";
export type AppView = "aid" | "activity" | "settings" | "send" | "escrow";

export interface AppRoute {
  id: AppView;
  href: string;
  label: string;
  mobileLabel: string;
  description: string;
}

export const aidRoles: Record<
  AidRole,
  { label: string; href: string; eyebrow: string; nextAction: string; responsibilities: string[] }
> = {
  donor: {
    label: "Donor",
    href: "/app/aid/donor",
    eyebrow: "Fund accountable recovery",
    nextAction: "Fund a vetted campaign and follow how value moves from available to reserved to paid.",
    responsibilities: ["Choose a campaign", "Fund with the campaign token", "Follow the delivery trail"],
  },
  coordinator: {
    label: "Coordinator",
    href: "/app/aid/coordinator",
    eyebrow: "Operate the relief program",
    nextAction: "Create cases, approve merchants, issue vouchers, or freeze a suspicious redeemed claim.",
    responsibilities: ["Set up the campaign", "Create opaque case IDs", "Issue purpose-limited vouchers"],
  },
  merchant: {
    label: "Merchant",
    href: "/app/aid/merchant",
    eyebrow: "Deliver and redeem",
    nextAction: "Add the required trustline, redeem an issued voucher, and submit only an evidence digest.",
    responsibilities: ["Deliver approved goods", "Submit evidence[0]", "Append one revision only after freeze"],
  },
  verifier: {
    label: "Verifier",
    href: "/app/aid/verifier",
    eyebrow: "Make an attributable decision",
    nextAction: "Approve clean redeemed evidence or reject a frozen claim using an opaque reason digest.",
    responsibilities: ["Stay independent from the merchant", "Review opaque evidence records", "Approve or reject"],
  },
};

export const primaryRoutes: AppRoute[] = [
  {
    id: "aid",
    href: "/app",
    label: "Aid overview",
    mobileLabel: "Aid",
    description: "Role-guided relief workflows",
  },
  {
    id: "activity",
    href: "/app/activity",
    label: "Activity",
    mobileLabel: "Activity",
    description: "Receipts and audit trail",
  },
  {
    id: "settings",
    href: "/app/settings",
    label: "Settings",
    mobileLabel: "Settings",
    description: "Network and preferences",
  },
];

export const protocolRoutes: AppRoute[] = [
  {
    id: "send",
    href: "/app/tools/send",
    label: "Send payment",
    mobileLabel: "Send",
    description: "General Stellar transfer",
  },
  {
    id: "escrow",
    href: "/app/tools/escrow",
    label: "Milestone escrow",
    mobileLabel: "Escrow",
    description: "Client and freelancer tools",
  },
];
