import type { IUser } from "./interfaces";

export const roleOptions: { key: IUser["role"]; label: string; value: IUser["role"] }[] = [
    { key: "RECIPIENT", label: "Calon Penerima", value: "RECIPIENT" },
    { key: "HEAD_OF_OFFICE", label: "Kepala Kantor Lurah", value: "HEAD_OF_OFFICE" },
    { key: "ADMIN", label: "Admin", value: "ADMIN" },
];

/** Derived map — single source of truth. Add new roles to roleOptions above. */
export const ROLE_LABEL_MAP: Record<IUser["role"], string> = Object.fromEntries(
    roleOptions.map((o) => [o.value, o.label]),
) as Record<IUser["role"], string>;

