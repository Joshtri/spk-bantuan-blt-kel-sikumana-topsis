import { ColumnTable } from "@/components/table/types";
import { ICandidateRecipient } from "./interfaces";
import { BooleanChip } from "@/components/boolean-chip";
import { Link } from "@heroui/react";

export const getCandidateRecipientColumns = (
  isHeadOfOffice: boolean,
): ColumnTable<ICandidateRecipient>[] => [
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
  {
    key: "isHaveAccount",
    title: "Sudah Punya Akun",
    render: (item) =>
      item.isHaveAccount || isHeadOfOffice ? (
        <BooleanChip
          value={item.isHaveAccount}
          trueLabel="Sudah"
          falseLabel="Belum"
        />
      ) : (
        <Link
          href={`/users/create?candidateRecipientId=${item.id}`}
          className="no-underline"
        >
          <BooleanChip
            value={item.isHaveAccount}
            trueLabel="Sudah"
            falseLabel="Belum"
          />
        </Link>
      ),
  },
  {
    key: "isFilledCurrentPeriod",
    title: "Sudah Mengisi Periode Aktif",
    render: (item) => (
      <BooleanChip
        value={item.isFilledCurrentPeriod ?? false}
        trueLabel="Sudah"
        falseLabel="Belum"
      />
    ),
  },
];
