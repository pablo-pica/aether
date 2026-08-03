"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { ProductEventName, sanitizeProductProperties } from "@/lib/observability";

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function trackProductEvent(event: ProductEventName, properties: Record<string, unknown> = {}) {
  if (!posthogKey || typeof window === "undefined") return;
  posthog.capture(event, sanitizeProductProperties(event, properties));
}

export default function ObservabilityProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  useEffect(() => {
    if (!posthogKey) return;

    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      capture_pageview: false,
      autocapture: false,
      disable_session_recording: true,
      person_profiles: "identified_only",
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;
    trackProductEvent("page_view", { path: pathname });
  }, [pathname]);

  return children;
}
