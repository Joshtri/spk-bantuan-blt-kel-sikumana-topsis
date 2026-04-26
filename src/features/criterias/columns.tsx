import { ColumnTable } from "@/components/table/types";

interface ICriteria {
  id: number;
  name: string;
  weight: number;
  type: "benefit" | "cost";
}

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
    key: "type",
    title: "Tipe",
    render: (item) => (item.type === "benefit" ? "Benefit" : "Cost"),
  },
];
