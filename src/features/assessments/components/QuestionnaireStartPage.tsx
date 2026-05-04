import { useState } from "react";
import { useCustom, useNavigation, useOne } from "@refinedev/core";
import { Button, Card, Checkbox, Chip, Separator, cn } from "@heroui/react";
import {
  ArrowLeftIcon,
  ClipboardDocumentCheckIcon,
  ClockIcon,
  DocumentTextIcon,
  ListBulletIcon,
  PlayIcon,
  ShieldExclamationIcon,
  Squares2X2Icon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Heading } from "@/components/heading";
import LoadingScreen from "@/components/loading/LoadingScreen";
import type { ApiResponse } from "@/interfaces/IBaseEntity";
import type { ICandidateRecipient } from "@/features/candidate-recipients/interfaces";
import type { IPeriod } from "@/features/periods/interfaces";
import type {
  CriteriasWithScalesVm,
  ICriteriaWithScales,
} from "@/app/pages/list-question/page";

interface QuestionnaireStartPageProps {
  candidateId: string;
  onStart: () => void;
}

const INSTRUCTIONS = [
  "Pilih salah satu opsi pada setiap pertanyaan sesuai kondisi calon penerima.",
  "Tidak ada jawaban benar atau salah — pilih yang paling menggambarkan kondisi.",
  "Pastikan seluruh pertanyaan terjawab sebelum mengirim hasil penilaian.",
  "Hasil yang sudah dikirim akan diolah menggunakan metode TOPSIS.",
];

export function QuestionnaireStartPage({
  candidateId,
  onStart,
}: QuestionnaireStartPageProps) {
  const { list } = useNavigation();
  const [hasReadInstructions, setHasReadInstructions] = useState(false);
  const [hasAgreed, setHasAgreed] = useState(false);

  const {
    result: questionsResult,
    query: { isLoading: isLoadingQuestions },
  } = useCustom<ApiResponse<CriteriasWithScalesVm>>({
    url: "criterias/with-scales",
    method: "get",
  });

  const {
    result: periodResult,
    query: { isLoading: isLoadingPeriod },
  } = useCustom<ApiResponse<IPeriod>>({
    url: "periods/current-active",
    method: "get",
  });

  const { result: candidateResult } = useOne<ICandidateRecipient>({
    resource: "candidate-recipients",
    id: candidateId,
    queryOptions: { enabled: !!candidateId },
  });

  const criteriaList: ICriteriaWithScales[] =
    questionsResult?.data?.data?.criterias ?? [];
  const period = periodResult?.data?.data;
  const candidate = candidateResult;

  const totalCriteria = criteriaList.length;
  const estimatedTime = Math.max(1, Math.ceil(totalCriteria * 0.5));
  const totalScales = criteriaList.reduce(
    (acc, c) => acc + (c.scales?.length ?? 0),
    0,
  );

  const hasActivePeriod = !!period;
  const canStart =
    hasReadInstructions && hasAgreed && totalCriteria > 0 && hasActivePeriod;

  if (isLoadingQuestions || isLoadingPeriod) {
    return <LoadingScreen />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      <Button
        variant="ghost"
        size="sm"
        onPress={() => list("assessments")}
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Kembali
      </Button>

      {/* Hero */}
      <div className="space-y-4 text-center">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 shadow-lg shadow-primary/30">
          <ClipboardDocumentCheckIcon className="h-10 w-10  " />
        </div>
        <Heading as="h1" size="3xl" align="center">
          Penilaian Calon Penerima
        </Heading>
        <p className="mx-auto max-w-xl text-base text-default-600">
          Lakukan penilaian dengan menjawab semua pertanyaan berdasarkan
          kondisi nyata calon penerima.
        </p>
        {candidate && (
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2">
            <UserIcon className="h-4 w-4 text-primary-600" />
            <span className="text-sm text-default-500">Calon:</span>
            <span className="text-sm font-semibold text-default-800">
              {candidate.recipientName}
            </span>
          </div>
        )}
        {period && (
          <div className="flex justify-center">
            <Chip size="sm" variant="soft" color="accent">
              Periode: {period.name}
            </Chip>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <Card.Content className="flex flex-col items-center gap-1 py-4 text-center">
            <ListBulletIcon className="h-7 w-7 text-primary-500" />
            <p className="text-2xl font-bold text-primary-600">
              {totalCriteria}
            </p>
            <p className="text-xs text-default-500">Pertanyaan</p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex flex-col items-center gap-1 py-4 text-center">
            <Squares2X2Icon className="h-7 w-7 text-accent-500" />
            <p className="text-2xl font-bold text-accent-600">{totalScales}</p>
            <p className="text-xs text-default-500">Total Opsi</p>
          </Card.Content>
        </Card>
        <Card>
          <Card.Content className="flex flex-col items-center gap-1 py-4 text-center">
            <ClockIcon className="h-7 w-7 text-warning-500" />
            <p className="text-2xl font-bold text-warning-600">
              ~{estimatedTime}
            </p>
            <p className="text-xs text-default-500">Menit</p>
          </Card.Content>
        </Card>
      </div>

      {/* Instructions */}
      <Card>
        <Card.Header className="flex flex-row items-start gap-3 p-5">
          <div className="rounded-lg bg-primary-100 p-2">
            <DocumentTextIcon className="h-5 w-5 text-primary-600" />
          </div>
          <div className="flex flex-col">
            <Heading as="h3" size="lg">
              Petunjuk Pengisian
            </Heading>
            <p className="text-sm text-default-500">
              Baca dengan teliti sebelum memulai
            </p>
          </div>
        </Card.Header>
        <Separator />
        <Card.Content className="space-y-3 p-5">
          {INSTRUCTIONS.map((text, idx) => (
            <div key={idx} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100">
                <span className="text-xs font-bold text-primary-600">
                  {idx + 1}
                </span>
              </div>
              <p className="text-sm text-default-700">{text}</p>
            </div>
          ))}
        </Card.Content>
      </Card>

      {/* No-active-period banner */}
      {!hasActivePeriod && (
        <Card className="border-2 border-danger-200 bg-danger-50">
          <Card.Content className="p-5">
            <div className="flex gap-3">
              <ShieldExclamationIcon className="h-6 w-6 shrink-0 text-danger-600" />
              <div className="space-y-1">
                <p className="font-semibold text-danger-700">
                  Tidak Ada Periode Aktif
                </p>
                <p className="text-sm text-danger-600">
                  Penilaian belum bisa dimulai karena tidak ada periode yang
                  aktif. Aktifkan periode terlebih dahulu di menu Periode.
                </p>
              </div>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Disclaimer */}
      <Card className="border-2 border-warning-200 bg-warning-50">
        <Card.Content className="p-5">
          <div className="flex gap-3">
            <ShieldExclamationIcon className="h-6 w-6 shrink-0 text-warning-600" />
            <div className="space-y-1">
              <p className="font-semibold text-warning-700">
                Penting untuk Diketahui
              </p>
              <p className="text-sm text-warning-600">
                Hasil penilaian ini menjadi dasar perhitungan TOPSIS untuk
                menentukan kelayakan calon penerima bantuan. Pastikan data
                yang dimasukkan akurat dan jujur.
              </p>
            </div>
          </div>
        </Card.Content>
      </Card>

      {/* Agreement */}
      <Card>
        <Card.Content className="space-y-4 p-5">
          <Checkbox
            isSelected={hasReadInstructions}
            onChange={setHasReadInstructions}
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <span className="text-sm text-default-700">
                Saya telah membaca dan memahami petunjuk pengisian di atas.
              </span>
            </Checkbox.Content>
          </Checkbox>
          <Checkbox isSelected={hasAgreed} onChange={setHasAgreed}>
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <span className="text-sm text-default-700">
                Saya bersedia mengisi penilaian dengan jujur dan obyektif.
              </span>
            </Checkbox.Content>
          </Checkbox>
        </Card.Content>
      </Card>

      {/* Start CTA */}
      <div className="flex flex-col items-center gap-3 pt-2">
        <Button
          size="lg"
          variant="primary"
          isDisabled={!canStart}
          onPress={onStart}
          className={cn(
            "w-full px-12 font-semibold sm:w-auto",
            canStart && "shadow-lg shadow-primary/30",
          )}
        >
          <PlayIcon className="h-5 w-5" />
          Mulai Penilaian
        </Button>
        {!canStart && totalCriteria > 0 && (
          <p className="text-xs text-default-400">
            Centang kedua persetujuan di atas untuk memulai.
          </p>
        )}
        {totalCriteria === 0 && (
          <p className="text-xs text-danger-500">
            Belum ada kriteria yang tersedia. Tambahkan kriteria terlebih
            dahulu.
          </p>
        )}
      </div>
    </div>
  );
}
