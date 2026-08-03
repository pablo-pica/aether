import * as Sentry from "@sentry/nextjs";
import { scrubSentryEvent } from "./src/lib/observability";

Sentry.init({
  dsn: process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
  sendDefaultPii: false,
  tracesSampleRate: 0.1,
  beforeSend(event) {
    return scrubSentryEvent(event);
  },
});
