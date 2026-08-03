import { describe, expect, it } from "vitest";
import { sanitizeProductProperties, scrubSentryEvent } from "./observability";

describe("observability privacy boundary", () => {
  it("keeps only the explicit, non-identifying analytics properties", () => {
    expect(
      sanitizeProductProperties("operation_outcome", {
        operation: "fund_campaign",
        outcome: "completed",
        latency_bucket: "2-5s",
        wallet_address: "GBSECRET",
        transaction_hash: "abc123",
        campaign_id: "campaign-1",
        error: "raw RPC response",
      }),
    ).toEqual({
      operation: "fund_campaign",
      outcome: "completed",
      latency_bucket: "2-5s",
    });
  });

  it("redacts sensitive data from error-monitoring events recursively", () => {
    const result = scrubSentryEvent({
      user: { id: "GBSECRET", email: "person@example.com" },
      request: {
        url: "https://aethyr.example/aid?wallet_address=GBSECRET",
        headers: { authorization: "Bearer secret" },
        data: { transaction_xdr: "AAAA", message: "safe" },
      },
      extra: { voucher_id: "voucher-1", nested: { evidence_digest: "digest", safe: "ok" } },
      breadcrumbs: [{ message: "raw provider response" }],
    });

    expect(result).toEqual({
      user: undefined,
      request: {
        url: "https://aethyr.example/aid",
        headers: undefined,
        data: { message: "safe" },
      },
      extra: { nested: { safe: "ok" } },
    });
    expect(result).not.toHaveProperty("breadcrumbs");
  });
});
