import { ColumnTable } from "@/components/table/types";
import { ICandidateRecipient } from "./interfaces";

export const candidateRecipientColumns: ColumnTable<ICandidateRecipient>[] = [
  {
    key: "nik",
    title: "NIK",
  },
  {
    key: "recipientName",
    title: "Nama Calon Penerima",
  },
  {
    key: "dateOfBirth",
    title: "Tanggal Lahir",
  },
];
