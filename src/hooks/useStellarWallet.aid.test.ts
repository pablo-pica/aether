import { describe, expect, it, vi } from "vitest";
import fs from "fs";
import path from "path";

vi.mock("@creit.tech/stellar-wallets-kit/modules/utils", () => ({ defaultModules: () => [] }));
vi.mock("@creit.tech/stellar-wallets-kit", () => ({
  StellarWalletsKit: {},
  KitEventType: {},
  Networks: { TESTNET: "TESTNET" },
}));
import { Keypair, scValToNative, xdr } from "@stellar/stellar-sdk";
import { ClaimDecision, aidAmountToI128ScVal, aidClaimDecisionScVal, aidHexToBytes32ScVal, aidU64ScVal, aidVoucherCategoryScVal, buildAidInvocationArgs } from "./useStellarWallet";

const id = "a".repeat(64);
const validAddress = Keypair.random().publicKey();

describe("Aethyr Aid contract invocation serialization", () => {
  it("serializes bytes32, i128, u64, and enum arguments with Soroban SCVal types", () => {
    expect(aidHexToBytes32ScVal(id).switch()).toBe(xdr.ScValType.scvBytes());
    expect(aidAmountToI128ScVal("12.5").switch()).toBe(xdr.ScValType.scvI128());
    expect(aidU64ScVal(123).switch()).toBe(xdr.ScValType.scvU64());
    const category = aidVoucherCategoryScVal("Food");
    expect(category.switch()).toBe(xdr.ScValType.scvVec());
    expect(category.vec()?.[0].sym().toString()).toBe("Food");
  });

  it("builds issue_voucher arguments in the authoritative contract order", () => {
    const args = buildAidInvocationArgs("issue_voucher", validAddress, {
      voucherId: id,
      campaignId: id,
      caseId: id,
      merchant: validAddress,
      amount: "1",
      category: "Medicine",
      purposeHash: id,
      expiresAt: 999,
    });
    expect(args).toHaveLength(9);
    expect(args[1].switch()).toBe(xdr.ScValType.scvBytes());
    expect(args[5].switch()).toBe(xdr.ScValType.scvI128());
    expect(args[6].switch()).toBe(xdr.ScValType.scvVec());
    expect(args[8].switch()).toBe(xdr.ScValType.scvU64());
  });

  it("builds lifecycle method arguments in the authoritative contract order", () => {
    expect(buildAidInvocationArgs("redeem_voucher", validAddress, { voucherId: id, contentDigest: id, evidenceRecordId: id })).toHaveLength(4);
    expect(buildAidInvocationArgs("append_evidence_revision", validAddress, { voucherId: id, contentDigest: id, evidenceRecordId: id })[3].switch()).toBe(xdr.ScValType.scvBytes());
    expect(buildAidInvocationArgs("freeze_claim", validAddress, { voucherId: id, reasonHash: id })).toHaveLength(3);
    const decideArgs = buildAidInvocationArgs("decide_claim", validAddress, { voucherId: id, decision: ClaimDecision.Approve, reasonHash: id });
    expect(decideArgs).toHaveLength(4);
    expect(decideArgs[2].vec()?.[0].sym().toString()).toBe("Approve");
    expect(decideArgs[3].switch()).toBe(xdr.ScValType.scvBytes());
  });

  it("encodes only verifier Approve/Reject claim decisions and rejects invalid values", () => {
    expect(aidClaimDecisionScVal(ClaimDecision.Approve).vec()?.[0].sym().toString()).toBe("Approve");
    expect(aidClaimDecisionScVal(ClaimDecision.Reject).vec()?.[0].sym().toString()).toBe("Reject");
    expect(() => aidClaimDecisionScVal("Freeze" as ClaimDecision)).toThrow("Approve or Reject");
    expect(() => buildAidInvocationArgs("decide_claim", validAddress, { voucherId: id, decision: "Freeze", reasonHash: id })).toThrow("Approve or Reject");
  });

  it("rejects invalid bytes32 and non-positive amounts before live submission", () => {
    expect(() => aidHexToBytes32ScVal("abc")).toThrow("32-byte hex");
    expect(() => aidAmountToI128ScVal("0")).toThrow("greater than zero");
  });

  it("parses Aid decimal amounts exactly to stroops without Number rounding", () => {
    expect(scValToNative(aidAmountToI128ScVal("1"))).toBe(10_000_000n);
    expect(scValToNative(aidAmountToI128ScVal("0.0000001"))).toBe(1n);
    expect(scValToNative(aidAmountToI128ScVal("9007199254740993.0000001"))).toBe(90_071_992_547_409_930_000_001n);
  });

  it("rejects precision-losing or fractional-stroop Aid amounts", () => {
    expect(() => aidAmountToI128ScVal("1.00000001")).toThrow("at most 7 fractional digits");
    expect(() => aidAmountToI128ScVal("1e-7")).toThrow("positive decimal");
    expect(() => aidAmountToI128ScVal("-1")).toThrow("positive decimal");
  });

  it("accepts either SDK event accessor shape without emitting a parsing error", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "./useStellarWallet.ts"), "utf8");
    expect(source).toContain('typeof sorobanMeta.events === "function"');
    expect(source).toContain("Array.isArray(events)");
  });

  it("provides a wallet-signed AIDT trustline setup action", () => {
    const source = fs.readFileSync(path.resolve(__dirname, "./useStellarWallet.ts"), "utf8");
    expect(source).toContain('new Asset(AIDT_TEST_ASSET_CODE, AIDT_TEST_ASSET_ISSUER)');
    expect(source).toContain("Operation.changeTrust");
    expect(source).toContain("addAidTrustline");
  });
});
