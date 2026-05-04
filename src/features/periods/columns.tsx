import { ColumnTable } from "@/components/table/types";
import { IPeriod } from "./interfaces";
import { formatDate } from "@/utils/date";
import { IsActiveSwitch } from "./form/ActivatedPeriodSwitch";

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
    render: (item) => formatDate(item.startDate, { withTime: true }),
  },
  {
    key: "endDate",
    title: "Tanggal Selesai",
    render: (item) => formatDate(item.endDate, { withTime: true }),
  },
  {
    key: "isActive",
    title: "Aktif",
    align: "center",
    render: (item) => <IsActiveSwitch item={item} />,
  },
];
