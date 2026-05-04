import { useEffect, useMemo, useState } from "react";
import {
  useCreate,
  useCustom,
  useNavigation,
  useOne,
  type BaseRecord,
  type HttpError,
} from "@refinedev/core";
import { AlertDialog, Button, Card, Chip, cn, toast } from "@heroui/react";
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  PaperAirplaneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { Heading } from "@/components/heading";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { useIdentity } from "@/hooks/useIdentity";
import type { ApiResponse } from "@/interfaces/IBaseEntity";
import type { ICandidateRecipient } from "@/features/candidate-recipients/interfaces";
import type { IPeriod } from "@/features/periods/interfaces";
import type {
  CriteriasWithScalesVm,
  ICriteriaWithScales,
} from "@/app/pages/list-question/page";

import { QuestionnaireItem } from "./QuestionnaireItem";

interface QuestionnaireFormProps {
  candidateId: string;
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function QuestionnaireForm({ candidateId }: QuestionnaireFormProps) {
  const { list } = useNavigation();
  const { identity } = useIdentity();

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createAssessment } = useCreate<
    BaseRecord,
    HttpError,
    {
      periodId: string;
      candidateId: string;
      assessedByUserId: string;
      criteriaScaleIds: string[];
    }
  >();

  const {
    result: questionsResult,
    query: { isLoading: isLoadingQuestions, isError: isQuestionsError },
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

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const totalQuestions = criteriaList.length;
  const answeredCount = useMemo(
    () => criteriaList.reduce((acc, c) => (answers[c.id] ? acc + 1 : acc), 0),
    [criteriaList, answers],
  );
  const progressPercent =
    totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
  const isAllComplete = totalQuestions > 0 && answeredCount === totalQuestions;

  const handleAnswerChange = (criteriaId: string, criteriaScaleId: string) => {
    setAnswers((prev) => ({ ...prev, [criteriaId]: criteriaScaleId }));
  };

  const handleSubmit = async () => {
    if (!isAllComplete) {
      toast("Belum lengkap", {
        description: "Mohon jawab semua pertanyaan sebelum mengirim.",
        variant: "warning",
      });
      return;
    }
    if (!period?.id) {
      toast("Periode aktif tidak ditemukan", {
        description: "Tidak dapat menyimpan penilaian tanpa periode aktif.",
        variant: "danger",
      });
      return;
    }
    if (!identity?.id) {
      toast("Sesi tidak valid", {
        description: "Silakan login ulang sebelum menyimpan penilaian.",
        variant: "danger",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createAssessment({
        resource: "assessments",
        values: {
          periodId: String(period.id),
          candidateId,
          assessedByUserId: identity.id,
          criteriaScaleIds: Object.values(answers),
        },
        successNotification: {
          message: "Penilaian berhasil disimpan",
          type: "success",
        },
        errorNotification: false,
      });
      list("assessments");
    } catch (err) {
      const httpError = err as HttpError;
      const fieldErrors = httpError.errors;
      if (fieldErrors && Object.keys(fieldErrors).length > 0) {
        const summary = Object.entries(fieldErrors)
          .map(([k, v]) => `${k}: ${v}`)
          .join("\n");
        toast("Validasi gagal", {
          description: summary,
          variant: "danger",
        });
      } else {
        toast("Gagal menyimpan penilaian", {
          description: httpError.message ?? "Terjadi kesalahan. Coba lagi.",
          variant: "danger",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingQuestions || isLoadingPeriod) {
    return <LoadingScreen />;
  }

  if (isQuestionsError || criteriaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-100">
          <ExclamationTriangleIcon className="h-8 w-8 text-danger-600" />
        </div>
        <Heading as="h2" size="xl">
          Gagal Memuat Pertanyaan
        </Heading>
        <p className="max-w-md text-default-500">
          Tidak ada kriteria yang tersedia atau terjadi kesalahan saat mengambil
          data. Silakan coba lagi.
        </p>
        <Button variant="outline" onPress={() => window.location.reload()}>
          Muat Ulang
        </Button>
      </div>
    );
  }

  if (!period) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-warning-100">
          <ExclamationTriangleIcon className="h-8 w-8 text-warning-600" />
        </div>
        <Heading as="h2" size="xl">
          Tidak Ada Periode Aktif
        </Heading>
        <p className="max-w-md text-default-500">
          Penilaian tidak dapat dilakukan karena belum ada periode yang aktif.
          Aktifkan periode terlebih dahulu di menu Periode.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onPress={() => list("periods")}>
            Buka Menu Periode
          </Button>
          <Button variant="ghost" onPress={() => list("candidate-recipients")}>
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 pb-32">
      {/* Top bar */}
      <div className="flex items-center justify-between gap-4">
        {answeredCount === 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onPress={() => list("assessments")}
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Kembali
          </Button>
        ) : (
          <AlertDialog>
            <Button variant="ghost" size="sm">
              <ArrowLeftIcon className="h-4 w-4" />
              Kembali 
            </Button>
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog>
                  {({ close }) => (
                    <>
                      <AlertDialog.CloseTrigger />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="warning" />
                        <AlertDialog.Heading>
                          Tinggalkan halaman penilaian?
                        </AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p>
                          Anda sudah menjawab <strong>{answeredCount}</strong>{" "}
                          dari <strong>{totalQuestions}</strong> pertanyaan.
                          Jawaban yang sudah diisi akan <strong>hilang</strong>{" "}
                          jika Anda keluar sekarang.
                        </p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="tertiary">
                          Lanjut Mengisi
                        </Button>
                        <Button
                          variant="danger"
                          onPress={() => {
                            close();
                            list("candidate-recipients");
                          }}
                        >
                          Ya, Keluar
                        </Button>
                      </AlertDialog.Footer>
                    </>
                  )}
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        )}
        <Card className="border border-primary-100 shadow-sm">
          <Card.Content className="flex flex-row items-center gap-3 px-4 py-2">
            <ClockIcon className="h-5 w-5 text-primary" />
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-bold uppercase tracking-wider text-default-400">
                Waktu Berjalan
              </span>
              <span className="font-mono text-base font-bold text-primary">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </Card.Content>
        </Card>
      </div>

      {/* Hero / context card */}
      <Card>
        <Card.Content className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary-100 p-3">
              <ClipboardDocumentCheckIcon className="h-7 w-7 text-primary-600" />
            </div>
            <div className="space-y-1">
              <Heading as="h1" size="xl" weight="bold">
                Beri Penilaian
              </Heading>
              <p className="text-sm text-default-500">
                Jawab seluruh pertanyaan berikut untuk menilai calon penerima
                bantuan.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:items-end">
            {candidate && (
              <div className="flex items-center gap-2 text-sm">
                <UserIcon className="h-4 w-4 text-default-400" />
                <span className="text-default-500">Calon:</span>
                <span className="font-semibold text-default-800">
                  {candidate.recipientName}
                </span>
              </div>
            )}
            {period && (
              <Chip size="sm" variant="soft" color="accent">
                {period.name}
              </Chip>
            )}
          </div>
        </Card.Content>
      </Card>

      {/* Progress */}
      <Card className="shadow-sm">
        <Card.Content className="space-y-2 p-4">
          <div className="flex items-center justify-between text-sm font-medium">
            <span className="text-default-600">Progres Pengisian</span>
            <span
              className={cn(
                "font-semibold",
                isAllComplete ? "text-success" : "text-primary",
              )}
            >
              {answeredCount} / {totalQuestions} pertanyaan
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-default-100">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                isAllComplete ? "bg-success" : "bg-primary",
              )}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </Card.Content>
      </Card>

      {/* Questions */}
      <div className="grid gap-4">
        {criteriaList.map((criteria, idx) => (
          <QuestionnaireItem
            key={criteria.id}
            index={idx + 1}
            criteria={criteria}
            value={answers[criteria.id]}
            onChange={(scaleId) => handleAnswerChange(criteria.id, scaleId)}
          />
        ))}
      </div>

      {/* Sticky submit footer */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-default-200 bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 text-sm">
            {isAllComplete ? (
              <>
                <CheckCircleIcon className="h-5 w-5 text-success" />
                <span className="font-medium text-success">
                  Semua pertanyaan sudah dijawab
                </span>
              </>
            ) : (
              <span className="text-default-500">
                Sisa{" "}
                <strong className="text-default-800">
                  {totalQuestions - answeredCount}
                </strong>{" "}
                pertanyaan belum dijawab
              </span>
            )}
          </div>

          <AlertDialog>
            <Button
              variant="primary"
              isDisabled={!isAllComplete || isSubmitting}
              isPending={isSubmitting}
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              {isSubmitting ? "Menyimpan..." : "Selesai & Kirim"}
            </Button>
            <AlertDialog.Backdrop>
              <AlertDialog.Container>
                <AlertDialog.Dialog>
                  {({ close }) => (
                    <>
                      <AlertDialog.CloseTrigger />
                      <AlertDialog.Header>
                        <AlertDialog.Icon status="success" />
                        <AlertDialog.Heading>
                          Konfirmasi Pengiriman
                        </AlertDialog.Heading>
                      </AlertDialog.Header>
                      <AlertDialog.Body>
                        <p>
                          Anda telah menjawab semua pertanyaan dalam waktu{" "}
                          <strong>{formatTime(elapsedTime)}</strong>. Pastikan
                          jawaban sudah sesuai sebelum mengirim.
                        </p>
                      </AlertDialog.Body>
                      <AlertDialog.Footer>
                        <Button slot="close" variant="tertiary">
                          Periksa Lagi
                        </Button>
                        <Button
                          variant="primary"
                          isPending={isSubmitting}
                          onPress={() => {
                            handleSubmit();
                            close();
                          }}
                        >
                          Ya, Kirim Jawaban
                        </Button>
                      </AlertDialog.Footer>
                    </>
                  )}
                </AlertDialog.Dialog>
              </AlertDialog.Container>
            </AlertDialog.Backdrop>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
