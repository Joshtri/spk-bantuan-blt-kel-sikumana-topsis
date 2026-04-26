import { ColumnTable } from "@/components/table/types";
import { IPeriod } from "./interfaces";

export const periodColumns: ColumnTable<IPeriod>[] = [
  {
    key: "id",
    title: "ID",
  },
  {
    key: "name",
    title: "Nama Periode",
  },
  {
    key: "startDate",
    title: "Tanggal Mulai",
  },
  {
    key: "endDate",
    title: "Tanggal Selesai",
  },
];
