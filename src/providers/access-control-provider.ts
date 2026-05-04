import { AccessControlProvider } from "@refinedev/core";
import { authProvider } from "./auth-provider";
import { IAuthIdentity } from "@/interfaces/Authorize";

type Role = IAuthIdentity["role"];

const ALL_ACTIONS = ["list", "create", "edit", "delete", "show"] as const;

const PERMISSIONS: Record<Role, Record<string, string[]>> = {
  ADMIN: {
    dashboard: ["list"],
    users: [...ALL_ACTIONS],
    criterias: [...ALL_ACTIONS],
    "criteria-scales": [...ALL_ACTIONS],
    periods: [...ALL_ACTIONS],
    "candidate-recipients": [...ALL_ACTIONS],
    assessments: [...ALL_ACTIONS],
    reports: [...ALL_ACTIONS],
    "topsis-calculates": ["list"],
    "Daftar Pertanyaan": ["list"],
    "my-profile": ["list"],
  },
  HEAD_OF_OFFICE: {
    dashboard: ["list"],
    criterias: ["list", "show"],
    "criteria-scales": ["list", "show"],
    "candidate-recipients": ["list", "show"],
    assessments: ["list", "show"],
    reports: ["list", "show"],
    "my-profile": ["list"],
  },
  RECIPIENT: {
    dashboard: ["list"],
    "history-assessments": ["list", "show"],
    "my-profile": ["list"],

  },
};

function canAccess(role: Role, resource: string, action: string): boolean {
  const rolePerms = PERMISSIONS[role];
  if (!rolePerms) return false;
  return rolePerms[resource]?.includes(action) ?? false;
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action }) => {
    if (!authProvider.getIdentity) {
      return { can: false, reason: "Not authenticated" };
    }

    const identity = (await authProvider.getIdentity()) as IAuthIdentity | null;

    if (!identity) {
      return { can: false, reason: "Not authenticated" };
    }

    const allowed = canAccess(identity.role, resource ?? "", action);
    return {
      can: allowed,
      reason: allowed ? undefined : "Unauthorized",
    };
  },
};
