export type ProductEventName = "wallet_connection" | "operation_outcome" | "flow_started" | "page_view";

type SafeProperty = string | number | boolean;
type SafeProperties = Record<string, SafeProperty>;

const ALLOWED_PROPERTIES: Record<ProductEventName, ReadonlySet<string>> = {
  wallet_connection: new Set(["wallet_provider", "outcome", "error_category"]),
  operation_outcome: new Set(["operation", "outcome", "error_category", "latency_bucket", "sponsorship"]),
  flow_started: new Set(["operation", "role"]),
  page_view: new Set(["path"]),
};

const SENSITIVE_KEY = /(address|wallet|xdr|hash|campaign|case|voucher|evidence|email|name|token|authorization|cookie|secret|password|query)/i;

/**
 * Analytics events are deliberately allowlisted: operational telemetry must never
 * become a secondary store for wallet, transaction, or beneficiary data.
 */
export function sanitizeProductProperties(event: ProductEventName, properties: Record<string, unknown>): SafeProperties {
  const allowed = ALLOWED_PROPERTIES[event];
  return Object.entries(properties).reduce<SafeProperties>((safeProperties, [key, value]) => {
    if (allowed.has(key) && (typeof value === "string" || typeof value === "number" || typeof value === "boolean")) {
      safeProperties[key] = value;
    }
    return safeProperties;
  }, {});
}

function scrubValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(scrubValue);
  }
  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !SENSITIVE_KEY.test(key))
      .map(([key, nestedValue]) => [key, scrubValue(nestedValue)]),
  );
}

/** Compatible with Sentry's beforeSend callback without coupling app code to its event type. */
export function scrubSentryEvent<T extends Record<string, any>>(event: T): T {
  const scrubbed = scrubValue(event) as T;
  const sanitized = {
    ...scrubbed,
    user: undefined,
    exception: event.exception
      ? {
          values: event.exception.values?.map((value: Record<string, unknown>) => ({
            type: typeof value.type === "string" ? value.type : "Error",
            value: "Redacted error",
          })),
        }
      : undefined,
    request: event.request
      ? {
          ...scrubbed.request,
          url: typeof event.request.url === "string" ? event.request.url.split("?")[0] : undefined,
          headers: undefined,
        }
      : undefined,
  } as T;

  // Breadcrumbs commonly mirror console and HTTP payloads, which may include raw RPC errors.
  delete sanitized.breadcrumbs;
  return sanitized;
}

function errorCategory(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);
  if (/reject|declin|cancel/i.test(message)) return "user_rejected";
  if (/not installed|not enabled|not connected/i.test(message)) return "wallet_unavailable";
  if (/timeout|not found/i.test(message)) return "network_timeout";
  if (/insufficient|underfunded/i.test(message)) return "insufficient_balance";
  return "unknown";
}

function latencyBucket(elapsedMs: number): string {
  if (elapsedMs < 2_000) return "under_2s";
  if (elapsedMs < 5_000) return "2-5s";
  if (elapsedMs < 15_000) return "5-15s";
  return "over_15s";
}

export function walletConnectionProperties(walletProvider: string | undefined, error?: unknown): SafeProperties {
  return sanitizeProductProperties("wallet_connection", error
    ? { wallet_provider: walletProvider || "wallet_picker", outcome: "failed", error_category: errorCategory(error) }
    : { wallet_provider: walletProvider || "wallet_picker", outcome: "connected" });
}

export function operationOutcomeProperties(operation: string, startedAt: number, error?: unknown, sponsored?: boolean): SafeProperties {
  return sanitizeProductProperties("operation_outcome", {
    operation,
    outcome: error ? "failed" : "completed",
    error_category: error ? errorCategory(error) : undefined,
    latency_bucket: latencyBucket(Date.now() - startedAt),
    sponsorship: sponsored === undefined ? undefined : sponsored ? "sponsored" : "direct",
  });
}
