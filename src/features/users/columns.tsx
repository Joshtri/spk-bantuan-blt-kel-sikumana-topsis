import type { ColumnTable } from "@/components/table/types";
import type { IUser } from "./interfaces";
import { ROLE_LABEL_MAP } from "./options";

export const usersColumns: ColumnTable<IUser>[] = [
  {
    key: "username",
    title: "Username",
  },
  {
    key: "email",
    title: "Email",
  },

  {
    key: "role",
    title: "Role",
    render: (item: IUser) => ROLE_LABEL_MAP[item.role] ?? item.role,
  },
];
