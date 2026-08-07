"use client";

import { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";

import Dashboard from "@/components/dashboard/Dashboard";
import { AidRole, AppView, aidRoles } from "@/components/app-shell/appShellContent";

function routeState(pathname: string): { view: AppView; role: AidRole | null } {
  if (pathname.startsWith("/app/activity")) return { view: "activity", role: null };
  if (pathname.startsWith("/app/settings")) return { view: "settings", role: null };
  if (pathname.startsWith("/app/tools/send")) return { view: "send", role: null };
  if (pathname.startsWith("/app/tools/escrow")) return { view: "escrow", role: null };

  const match = pathname.match(/^\/app\/aid\/([^/]+)/);
  const candidate = match?.[1] as AidRole | undefined;
  if (candidate && candidate in aidRoles) return { view: "aid", role: candidate };

  return { view: "aid", role: null };
}

export default function AppWorkspaceController() {
  const pathname = usePathname() || "/app";
  const state = useMemo(() => routeState(pathname), [pathname]);

  useEffect(() => {
    if (state.role) window.localStorage.setItem("aethyr_aid_role", state.role);
    window.localStorage.setItem("aethyr_app_view", state.view);
  }, [state.role, state.view]);

  return <Dashboard initialView={state.view} initialRole={state.role} />;
}
