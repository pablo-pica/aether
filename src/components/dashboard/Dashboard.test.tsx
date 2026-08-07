// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

const wallet = vi.hoisted(() => ({
  connect: vi.fn(),
  disconnect: vi.fn(),
  sendXLM: vi.fn(),
  routePayment: vi.fn(),
  routeToEscrow: vi.fn(),
  releaseMilestone: vi.fn(),
  refundEscrow: vi.fn(),
  submitMilestone: vi.fn(),
  disputeMilestone: vi.fn(),
  autoReleaseMilestone: vi.fn(),
  addAidTrustline: vi.fn(),
  createCampaign: vi.fn(),
  fundCampaign: vi.fn(),
  approveMerchant: vi.fn(),
  createCase: vi.fn(),
  issueVoucher: vi.fn(),
  redeemVoucher: vi.fn(),
  appendEvidenceRevision: vi.fn(),
  freezeClaim: vi.fn(),
  decideClaim: vi.fn(),
}));

const aidCapture = vi.hoisted(() => ({ props: null as null | Record<string, unknown> }));

vi.mock("@/hooks/useStellarWallet", () => ({
  useStellarWallet: () => ({
    isConnected: false,
    isMockWallet: false,
    address: null,
    balance: null,
    error: null,
    isLoading: false,
    ...wallet,
  }),
}));

vi.mock("next/dynamic", () => ({ default: () => () => <div data-testid="wallet-connect" /> }));
vi.mock("@/components/ProfileDrawer", () => ({ default: () => null }));
vi.mock("@/components/WalletPickerBottomSheet", () => ({ default: () => null }));
vi.mock("@/components/SendTab", () => ({ default: () => <div>Send workspace</div> }));
vi.mock("@/components/EscrowTab", () => ({ default: () => <div>Escrow workspace</div> }));
vi.mock("@/components/ActivityTab", () => ({ default: () => <div>Activity workspace</div> }));
vi.mock("@/components/SettingsTab", () => ({ default: () => <div>Settings workspace</div> }));
vi.mock("@/components/AidTab", () => ({
  default: (props: Record<string, unknown>) => {
    aidCapture.props = props;
    return <div>Aid workspace</div>;
  },
}));
vi.mock("@/components/ui/Toast", () => ({
  Toast: () => null,
  ToastContainer: () => null,
}));

import Dashboard from "./Dashboard";

afterEach(() => {
  cleanup();
  aidCapture.props = null;
  localStorage.clear();
});

describe("operational dashboard route", () => {
  it("starts Aid-first and keeps Protocol tools reachable through route-driven views", () => {
    const { rerender } = render(<Dashboard />);

    expect(screen.getAllByText("Aid workspace").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "How are you helping?" })).toBeTruthy();
    ["Donor", "Coordinator", "Merchant", "Verifier"].forEach((role) => {
      expect(screen.getByRole("link", { name: new RegExp(role) })).toBeTruthy();
    });

    expect(screen.getByTestId("app-nav-activity").getAttribute("href")).toBe("/app/activity");
    expect(screen.getByTestId("app-nav-settings").getAttribute("href")).toBe("/app/settings");
    expect(screen.getByTestId("app-nav-send").getAttribute("href")).toBe("/app/tools/send");
    expect(screen.getByTestId("app-nav-escrow").getAttribute("href")).toBe("/app/tools/escrow");
    expect(screen.getByRole("link", { name: /Donor/ }).getAttribute("href")).toBe("/app/aid/donor");

    rerender(<Dashboard initialView="send" />);
    expect(screen.getByText("Send workspace").closest("section")?.hidden).toBe(false);
    rerender(<Dashboard initialView="escrow" />);
    expect(screen.getByText("Escrow workspace").closest("section")?.hidden).toBe(false);
  });

  it("synchronizes role guidance when browser navigation changes role routes", async () => {
    const { rerender } = render(<Dashboard initialView="aid" initialRole="donor" />);
    expect(screen.getByRole("heading", { name: "Donor view" })).toBeTruthy();

    rerender(<Dashboard initialView="aid" initialRole="coordinator" />);
    await waitFor(() => expect(screen.getByRole("heading", { name: "Coordinator view" })).toBeTruthy());
  });

  it("passes every existing Aid wallet operation through unchanged", () => {
    render(<Dashboard />);

    expect(aidCapture.props).toMatchObject({
      addAidTrustline: wallet.addAidTrustline,
      createCampaign: wallet.createCampaign,
      fundCampaign: wallet.fundCampaign,
      approveMerchant: wallet.approveMerchant,
      createCase: wallet.createCase,
      issueVoucher: wallet.issueVoucher,
      redeemVoucher: wallet.redeemVoucher,
      appendEvidenceRevision: wallet.appendEvidenceRevision,
      freezeClaim: wallet.freezeClaim,
      decideClaim: wallet.decideClaim,
    });
  });
});
