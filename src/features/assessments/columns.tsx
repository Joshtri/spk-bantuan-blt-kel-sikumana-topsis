import type { ColumnTable } from "@/components/table/types";
import type { IAssessment } from "./interfaces";

export const assessmentColumns: ColumnTable<IAssessment>[] = [
  {
    key: "periodName",
    title: "Periode",
  },
  {
    key: "candidateName",
    title: "Calon Penerima",
  },
  {
    key: "assessedByUsername",
    title: "Dinilai Oleh",
  },
  {
    key: "result",
    title: "Peringkat",
    render: (item: IAssessment) => item.result?.rank?.toString() ?? "-",
  },
  {
    key: "result",
    title: "Kelayakan",
    render: (item: IAssessment) => {
      if (!item.result) return "-";
      return item.result.isEligible ? "Layak" : "Tidak Layak";
    },
  },
];
