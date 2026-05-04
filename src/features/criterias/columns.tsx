import { ColumnTable } from "@/components/table/types";
import { Chip } from "@heroui/react";
import { ICriteria } from "./interfaces";

export const criteriaColumns: ColumnTable<ICriteria>[] = [
  {
    key: "name",
    title: "Nama Kriteria",
  },
  {
    key: "weight",
    title: "Bobot",
  },
  {
    key: "criteriaType",
    title: "Tipe",
    render: (item) => {
      return (
        <Chip
          color={item.criteriaType === "Cost" ? "danger" : "success"}
          size="sm"
          variant="primary"
        >
          {item.criteriaType}
        </Chip>
      );
    },
  },
  {
    key: "totalScale",
    title: "Total Skala",
    render(item) {
      return item.totalScale ?? 0;
    },
  }
];
