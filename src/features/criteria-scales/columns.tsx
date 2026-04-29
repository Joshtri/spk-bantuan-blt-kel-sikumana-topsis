import type { ColumnTable } from "@/components/table/types";
import type { ICriteriaScale } from "./interfaces";

export const criteriaScaleColumns: ColumnTable<ICriteriaScale>[] = [
  {
    key: "criteriaName",
    title: "Kriteria",
  },
  {
    key: "category",
    title: "Kategori",
  },
  {
    key: "scaleValue",
    title: "Nilai Skala",
  },
  {
    key: "description",
    title: "Deskripsi",
  },
];
