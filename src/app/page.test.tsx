// @vitest-environment jsdom

import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import fs from "fs";
import path from "path";

vi.mock("next/navigation", () => ({
  usePathname: () => "/app",
}));

vi.mock("@/hooks/useStellarWallet", () => ({
  useStellarWallet: () => ({
    isConnected: false,
    isMockWallet: false,
    address: null,
    balance: null,
    error: null,
    isLoading: false,
    connect: () => {},
    disconnect: () => {},
    sendXLM: () => {},
    routePayment: () => {},
    routeToEscrow: () => {},
    releaseMilestone: () => {},
    refundEscrow: () => {},
    submitMilestone: () => {},
    disputeMilestone: () => {},
    autoReleaseMilestone: () => {},
    addAidTrustline: () => {},
    createCampaign: () => {},
    fundCampaign: () => {},
    approveMerchant: () => {},
    createCase: () => {},
    issueVoucher: () => {},
    redeemVoucher: () => {},
    appendEvidenceRevision: () => {},
    freezeClaim: () => {},
    decideClaim: () => {},
  }),
}));

import LandingPage from "./page";
import AppDashboard from "../components/app-shell/AppWorkspaceController";
import PreviewPage from "./preview/page";

const dashboardPath = path.resolve(__dirname, "../components/dashboard/Dashboard.tsx");
const readSource = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf-8");


afterEach(() => cleanup());

describe("Aid-first route split", () => {
  it("exports standalone pages for / and /app", () => {
    expect(typeof LandingPage).toBe("function");
    expect(typeof AppDashboard).toBe("function");
  });

  it("renders the approved Bicol relief story and operational CTA", () => {
    render(<LandingPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Relief should arrive with proof." })).toBeTruthy();
    expect(screen.getByText("Built from Bato, Camarines Sur")).toBeTruthy();
    expect(screen.getAllByText(/Beneficiaries do not need wallets/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/blockchain does not verify real-world truth by itself/i)).toBeTruthy();

    const workspaceLinks = screen.getAllByRole("link", { name: /workspace|open \/app/i });
    expect(workspaceLinks.some((link) => link.getAttribute("href") === "/app")).toBe(true);
  });

  it("opens and closes the mobile navigation accessibly", () => {
    render(<LandingPage />);

    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(menuButton);
    expect(menuButton.getAttribute("aria-expanded")).toBe("true");

    const mobileNav = screen.getByRole("navigation", { name: "Mobile navigation" });
    expect(within(mobileNav).getByRole("link", { name: "Journey" })).toBeTruthy();
    expect(within(mobileNav).getByRole("link", { name: "Launch workspace" }).getAttribute("href")).toBe("/app");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });

  it("closes the mobile navigation after an in-page choice", () => {
    render(<LandingPage />);

    const menuButton = screen.getByRole("button", { name: "Open navigation menu" });
    fireEvent.click(menuButton);
    fireEvent.click(within(screen.getByRole("navigation", { name: "Mobile navigation" })).getByRole("link", { name: "Journey" }));

    expect(menuButton.getAttribute("aria-expanded")).toBe("false");
  });
});

describe("preserved operational dashboard contracts", () => {
  it("renders a responsive Aid-first app shell with route-backed links", () => {
    render(<AppDashboard />);

    expect(screen.getByTestId("app-shell")).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Primary app sections" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "Mobile app navigation" })).toBeTruthy();
    expect(screen.getByTestId("app-nav-send").getAttribute("href")).toBe("/app/tools/send");
    expect(screen.getByTestId("bottom-nav-tab-activity").getAttribute("href")).toBe("/app/activity");
    expect(screen.getByRole("link", { name: "Skip to workspace" }).getAttribute("href")).toBe("#main-content");
  });

  it("renders deterministic preview safety messaging and synchronized frames", () => {
    render(<PreviewPage />);

    expect(screen.getAllByText("Preview only / no transactions").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Desktop-only preview" })).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Synchronized desktop and phone" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Desktop preview frame" })).toBeTruthy();
    expect(screen.getByRole("region", { name: "Phone preview frame" })).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("truncates long transaction hashes in the activity feed", () => {
    const activity = readSource("../components/ActivityTab.tsx");
    expect(activity).toContain("tx.txHash.slice(0, 4)");
    expect(activity).toContain("tx.txHash.slice(-4)");
  });

  it("keeps the app shell and settings content available at narrow widths", () => {
    render(<AppDashboard />);
    expect(screen.getByTestId("app-shell").className).toContain("min-h-[100dvh]");
    expect(screen.getByRole("main").className).toContain("min-w-0");
    expect(readSource("../components/SettingsTab.tsx")).toContain("min-w-0");
  });

  it("retains the AI assist console", () => {
    const send = readSource("../components/SendTab.tsx");
    expect(send).toContain("AI Smart Assist Console");
    expect(send).toContain("Parse Command");
    expect(send).toContain("parseAiIntent");
  });

  it("retains routing visualization and cost comparison", () => {
    const send = readSource("../components/SendTab.tsx");
    expect(send).toContain("Router Route Path");
    expect(send).toContain("Exchange rate");
    expect(send).toContain("Competitors");
  });

  it("retains escrow release and refund controls", () => {
    const escrow = readSource("../components/EscrowTab.tsx");
    expect(escrow).toContain("Active Escrows");
    expect(escrow).toContain("Release");
    expect(escrow).toContain("Refund Expired Escrow");
  });

  it("retains every protocol and Aid section in the new navigation", () => {
    const content = readSource("../components/app-shell/appShellContent.ts");
    ["Send", "Escrow", "Activity", "Settings", "Aid overview"].forEach((label) => {
      expect(content).toContain(label);
    });

    const dashboard = fs.readFileSync(dashboardPath, "utf-8");
    expect(dashboard).toContain('activeTab === "aid"');
    expect(dashboard).toContain("<AidOverview");
  });

  it("uses the new font foundation and reduced-motion-safe landing primitives", () => {
    const layout = readSource("layout.tsx");
    const globals = readSource("../styles/globals.css");
    const landing = readSource("../components/landing/LandingPage.tsx");

    expect(layout).toContain("Bricolage_Grotesque");
    expect(layout).toContain("Manrope");
    expect(globals).toContain("Bricolage Grotesque");
    expect(globals).toContain("prefers-reduced-motion: reduce");
    expect(landing).toContain("useReducedMotion");
    expect(landing).toContain("function useMotionReady");
    expect(landing).toContain("supportsViewportObserver");
    expect(landing).toContain("useScroll");
    expect(landing).toContain("whileInView");
  });

  it("documents beginner onboarding tabs and role-vs-contract authority", () => {
    const overview = readSource("../components/workflows/aid/AidOverview.tsx");
    expect(overview).toContain("Start here");
    expect(overview).toContain("Field guide");
    expect(overview).toContain("Signing & safety");
    expect(overview).toContain("Role selection is only a local preference and never grants contract permissions");
    expect(overview).toContain("Campaign ID");
    expect(overview).toContain("token address");
    expect(overview).toContain("Evidence digest");
    expect(overview).toContain("aria-controls={`aid-guide-panel-${tab.id}`}");
    expect(overview).toContain("tabIndex={guideTab === tab.id ? 0 : -1}");
    expect(overview).toContain("onKeyDown={(event) => handleGuideTabKeyDown(event, index)}");
    expect(overview).toContain("role=\"tabpanel\"");
  });

  it("keeps the shared app controller persistent and route-derived", () => {
    const controller = readSource("../components/app-shell/AppWorkspaceController.tsx");
    const appLayout = readSource("app/layout.tsx");
    expect(controller).toContain("usePathname");
    expect(controller).toContain("aethyr_app_view");
    expect(controller).toContain("aethyr_aid_role");
    expect(controller).not.toContain("secret");
    expect(appLayout).toContain("AppWorkspaceController");
  });

  it("fixes selected Aid role card contrast without bg-white on active cards", () => {
    const chooser = readSource("../components/workflows/aid/AidRoleChooser.tsx");
    expect(chooser).toContain("bg-aid-ink text-white shadow-inner");
    expect(chooser).toContain("bg-white text-aid-ink hover:bg-aid-paper");
    expect(chooser).not.toContain("group min-h-48 bg-white p-5");
  });

  it("retains Aid role separation and the live/demo boundary", () => {
    const aid = readSource("../components/AidTab.tsx");
    expect(aid).toContain("deterministic local demo — never on-chain");
    expect(aid).toContain("Live Testnet");
    expect(aid).toContain("Merchant redemption workspace");
    expect(aid).toContain("Admin emergency-freeze control");
    expect(aid).toContain("Verifier-only review panel");
    expect(aid).toContain("No raw evidence or beneficiary personal data");
    expect(aid).toContain("Reserved");
    expect(aid).toContain("Available");
  });

  it("retains custom slippage and network selectors", () => {
    const settings = readSource("../components/SettingsTab.tsx");
    expect(settings).toContain("Slippage Tolerance");
    expect(settings).toContain("Futurenet");
    expect(settings).toContain("Local");
  });
});
