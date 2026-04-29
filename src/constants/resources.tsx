import {
  Squares2X2Icon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  UserPlusIcon,
  CalendarIcon,
  ScaleIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import type { IResourceItem } from "@refinedev/core";

export const RESOURCES: IResourceItem[] = [
  {
    name: "dashboard",
    list: "/",
    meta: {
      label: "Dashboard",
      icon: <Squares2X2Icon className="h-5 w-5" />,
    },
  },
  {
    name: "users",
    list: "/users",
    create: "/users/create",
    edit: "/users/edit/:id",
    show: "/users/show/:id",
    meta: {
      label: "Users",
      canDelete: true,
      icon: <UsersIcon className="h-5 w-5" />,
    },
  },
  {
    name: "criterias",
    list: "/kriteria",
    create: "/kriteria/create",
    edit: "/kriteria/edit/:id",
    show: "/kriteria/show/:id",
    meta: {
      label: "Kriteria",
      canDelete: true,
      icon: <AdjustmentsHorizontalIcon className="h-5 w-5" />,
    },
  },

  {
    name: "periods",
    list: "/periode",
    create: "/periode/create",
    edit: "/periode/edit/:id",
    show: "/periode/show/:id",
    meta: {
      label: "Periode",
      canDelete: true,
      icon: <CalendarIcon className="h-5 w-5" />,
    },
  },
  {
    name: "candidate-recipients",
    list: "/calon-penerima",
    create: "/calon-penerima/create",
    edit: "/calon-penerima/edit/:id",
    show: "/calon-penerima/show/:id",
    meta: {
      label: "Calon Penerima",
      canDelete: true,
      icon: <UserPlusIcon className="h-5 w-5" />,
    },
  },
  {
    name: "criteria-scales",
    list: "/skala-kriteria",
    create: "/skala-kriteria/create",
    edit: "/skala-kriteria/edit/:id",
    meta: {
      label: "Skala Kriteria",
      canDelete: true,
      icon: <ScaleIcon className="h-5 w-5" />,
    },
  },
  {
    name: "assessments",
    list: "/penilaian",
    create: "/penilaian/create",
    edit: "/penilaian/edit/:id",
    meta: {
      label: "Penilaian",
      canDelete: true,
      icon: <ClipboardDocumentListIcon className="h-5 w-5" />,
    },
  },
];
