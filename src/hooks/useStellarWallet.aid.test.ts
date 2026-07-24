import { describe, expect, it, vi } from "vitest";

vi.mock("@creit.tech/stellar-wallets-kit/modules/utils", () => ({ defaultModules: () => [] }));
vi.mock("@creit.tech/stellar-wallets-kit", () => ({
  StellarWalletsKit: {},
  KitEventType: {},
  Networks: { TESTNET: "TESTNET" },
}));
import { Keypair, scValToNative, xdr } from "@stellar/stellar-sdk";
import { aidAmountToI128ScVal, aidHexToBytes32ScVal, aidU64ScVal, aidVoucherCategoryScVal, buildAidInvocationArgs } from "./useStellarWallet";

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
});
