import { ICandidateRecipient } from "@/features/candidate-recipients/interfaces";
import { Avatar, Card } from "@heroui/react";
import { InfoRow } from "../InfoRow";

interface CandidateInfoCardProps {
  candidate: ICandidateRecipient;
}

export default function CandidateInformation({
  candidate,
}: CandidateInfoCardProps) {
  const initials = candidate.recipientName
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card
      variant="default"
      className="w-full rounded-2xl shadow-lg overflow-hidden"
    >
      {/* Colored header strip */}
      <div className="bg-primary/10 px-5 py-4 flex items-center gap-4">
        <Avatar size="lg" className="ring-2 ring-primary/20">
          <Avatar.Fallback className="bg-primary  font-semibold">
            {initials}
          </Avatar.Fallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-semibold text-base">
            {candidate.recipientName}
          </span>
          <span className="text-sm text-default-500">{candidate.nik}</span>
        </div>
      </div>

      <Card.Content className="pt-4 pb-5 px-5">
        {/* Grid of info rows */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <InfoRow
            label="Tanggal Lahir"
            value={new Date(candidate.dateOfBirth).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          />

          <InfoRow
            label="Jenis Kelamin"
            value={candidate.gender === "Male" ? "Laki-laki" : "Perempuan"}
          />

          <InfoRow label="No. Telepon" value={candidate.phoneNumber} />

          <InfoRow label="Alamat" value={candidate.address} />
        </div>
      </Card.Content>
    </Card>
  );
}
