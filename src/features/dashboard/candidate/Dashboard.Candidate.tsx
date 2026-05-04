import { useCustom } from "@refinedev/core";
import { Button, Card, Chip, Link, Spinner } from "@heroui/react";
import {
  ClipboardDocumentListIcon,
  TrophyIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  PhoneIcon,
} from "@heroicons/react/24/outline";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import { ApiListResponse } from "@/interfaces/IBaseEntity";
import { IAssessment } from "@/features/assessments/interfaces";
import { useIdentity } from "@/hooks/useIdentity";

export default function DashboardCandidate() {
  const { identity } = useIdentity();

  const { result, query } = useCustom<ApiListResponse<IAssessment>>({
    url: "assessments",
    method: "get",
    config: {
      query: {
        candidateId: identity?.candidateRecipientId ?? "",
        activePeriodOnly: "true",
      },
    },
    queryOptions: {
      enabled: !!identity?.candidateRecipientId,
    },
  });

  const assessment: IAssessment | undefined = result?.data?.data?.[0];
  const isLoading = query?.isLoading;

  return (
    <div className="space-y-6">
      {/* Assessment status for active period */}
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Status Penilaian Periode Aktif
        </p>

        {isLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spinner size="sm" />
          </div>
        ) : assessment ? (
          <AssessmentStatusCard assessment={assessment} />
        ) : (
          <NoAssessmentCard />
        )}
      </div>

      {/* Quick links */}
      <div>
        <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Menu
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card className="border border-default-100 shadow-sm transition-shadow hover:shadow-md">
            <Card.Content className="p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100">
                <ClipboardDocumentListIcon className="h-6 w-6 text-violet-600" />
              </div>
              <p className="mb-1 font-semibold text-gray-800">
                Riwayat Penilaian
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Lihat seluruh riwayat penilaian kamu di semua periode.
              </p>
              <Link
                href="/history-penilaian"
                className="text-sm font-medium text-violet-600 hover:text-violet-700"
              >
                Lihat Riwayat →
              </Link>
            </Card.Content>
          </Card>

          {/* <Card className="border border-default-100 shadow-sm transition-shadow hover:shadow-md">
            <Card.Content className="p-5">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100">
                <TrophyIcon className="h-6 w-6 text-sky-600" />
              </div>
              <p className="mb-1 font-semibold text-gray-800">Hasil Seleksi</p>
              <p className="mb-4 text-sm text-gray-500">
                Lihat hasil seleksi penerima bantuan menggunakan metode TOPSIS.
              </p>
              <Link
                href="/perhitungan-topsis"
                className="text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                Lihat Hasil →
              </Link>
            </Card.Content>
          </Card> */}
        </div>
      </div>
    </div>
  );
}

function AssessmentStatusCard({ assessment }: { assessment: IAssessment }) {
  const result = assessment.result;
  const isEligible = result?.isEligible;

  return (
    <Card className="border border-default-100 shadow-sm">
      <Card.Content className="p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <Text size="sm" color="muted">
              Periode
            </Text>
            <Heading
              as="h3"
              size="lg"
              weight="semibold"
              className="text-gray-800"
            >
              {assessment.periodName}
            </Heading>
            <Text size="sm" color="muted">
              Dinilai oleh: {assessment.assessedByUsername}
            </Text>
          </div>

          {result && (
            <Chip
              color={isEligible ? "success" : "danger"}
              size="lg"
              variant="soft"
            >
              <div className="flex items-center gap-2">
                {isEligible ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <XCircleIcon className="h-4 w-4" />
                )}
                <span>{isEligible ? "Layak Menerima" : "Tidak Layak"}</span>
              </div>
            </Chip>
          )}
        </div>

        {result && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <ResultItem
              label="Nilai Preferensi"
              value={result.preferenceValue.toFixed(4)}
            />
            <ResultItem label="Peringkat" value={`#${result.rank}`} />
            <ResultItem
              label="Jarak Positif"
              value={result.distancePositive.toFixed(4)}
            />
          </div>
        )}

        <div className="mt-6 border-t border-default-100 pt-4">
          <Link
            href={`/history-penilaian/show/${assessment.assessmentId}`}
            className="text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            Lihat Detail Penilaian →
          </Link>
        </div>
      </Card.Content>
    </Card>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Text size="xs" color="muted">
        {label}
      </Text>
      <p className="mt-0.5 text-lg font-semibold text-gray-800">{value}</p>
    </div>
  );
}

function NoAssessmentCard() {
  return (
    <Card className="border border-dashed border-default-200">
      <Card.Content className="flex flex-col items-center gap-3 p-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <ClockIcon className="h-7 w-7 text-gray-400" />
        </div>
        <Heading
          as="h3"
          size="base"
          weight="semibold"
          className="text-gray-700"
        >
          Belum ada penilaian
        </Heading>
        <Text size="sm" color="muted">
          Kamu belum memiliki penilaian pada periode aktif saat ini. Hubungi
          petugas jika ada pertanyaan.
        </Text>

        {/* redirect to whats app web */}
        <Button
          onPress={() => window.open("https://wa.me/6281234567890", "_blank")}
          variant="primary"
          size="sm"
        >
          {" "}
          <PhoneIcon /> Hubungi Petugas
        </Button>
      </Card.Content>
    </Card>
  );
}
