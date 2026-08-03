import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Add webpack or other configuration options here if needed
};

export default withSentryConfig(nextConfig, {
  silent: !process.env.CI,
  // Source-map upload remains opt-in until SENTRY_AUTH_TOKEN is configured in CI.
  sourcemaps: { disable: !process.env.SENTRY_AUTH_TOKEN },
});
