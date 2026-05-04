import { useCallback, useMemo } from "react";
import { Container } from "@/components/container";
import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { Card, Table, Chip, Button, Tooltip, toast, Link } from "@heroui/react";
import { useCustom, useCustomMutation, useInvalidate } from "@refinedev/core";
import { ApiResponse } from "@/interfaces/IBaseEntity";
import { IPeriod } from "@/features/periods/interfaces";
import { ICriteriaWithScales } from "@/app/pages/list-question/page";
import { ICriteriaScale } from "@/features/criteria-scales/interfaces";
import {
  calculateTopsisStepsForAssessments,
  CriteriaType,
  TopsisAssessmentInput,
  TopsisCriteriaInput,
  TopsisSteps,
} from "@/utils/topsis";
import EmptyState from "@/components/empty-state";
import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

const formatNumber = (value: number): string => {
  return Number(value).toFixed(4);
};

function CriteriaColumnHeader({ code, name }: { code: string; name: string }) {
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span className="cursor-default underline decoration-dotted">
          {code}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content>{name}</Tooltip.Content>
    </Tooltip>
  );
}

export default function TopsisCalculatesPage() {
  const invalidate = useInvalidate();

  // 1. Fetch current active period
  const { result: periodResult, query: periodQuery } = useCustom<
    ApiResponse<IPeriod>
  >({
    url: "periods/current-active",
    method: "get",
  });

  const period = periodResult?.data?.data;
  const isPeriodLoading = periodQuery.isLoading;

  // 2. Fetch assessments for the active period
  const { result: assessmentsResult, query: assessmentsQuery } = useCustom<
    ApiResponse<
      {
        id: string;
        candidateId: string;
        candidateName: string;
        details: { criteriaScaleId: string; scaleValue: number }[];
      }[]
    >
  >({
    url: period?.id ? `assessments?periodId=${period.id}` : "assessments",
    method: "get",
    // Only run when period is available
    ...(period?.id ? {} : { enabled: false }),
  });

  const assessments = Array.isArray(assessmentsResult?.data?.data)
    ? assessmentsResult.data.data
    : [];
  const isAssessmentsLoading = assessmentsQuery.isLoading;

  // 3. Fetch criteria with scales
  const { result: criteriaResult, query: criteriaQuery } = useCustom<
    ApiResponse<ICriteriaWithScales[]>
  >({
    url: "criterias/with-scales",
    method: "get",
  });

  const criteriasRaw = Array.isArray(criteriaResult?.data?.data?.criterias)
    ? criteriaResult.data.data.criterias
    : [];
  const isCriteriasLoading = criteriaQuery.isLoading;

  // 4. Build TOPSIS input and calculate
  const topsisSteps: TopsisSteps | null = useMemo(() => {
    if (assessments.length === 0 || criteriasRaw.length === 0) {
      return null;
    }

    const topsisAssessments: TopsisAssessmentInput[] = assessments.map((a) => ({
      id: a.id,
      details: a.details.map((d) => ({
        criteriaScaleId: d.criteriaScaleId,
        scaleValue: d.scaleValue,
      })),
    }));

    const topsisCriterias: TopsisCriteriaInput[] = criteriasRaw.map((c) => ({
      id: c.id,
      weight: c.weight,
      criteriaType:
        c.criteriaType === "Benefit" ? CriteriaType.Benefit : CriteriaType.Cost,

      scales: (c.scales ?? []).map((s: ICriteriaScale) => ({
        id: s.id,
        criteriaId: s.criteriaId,
        scaleValue: s.scaleValue,
      })),
    }));

    return calculateTopsisStepsForAssessments(
      topsisAssessments,
      topsisCriterias,
    );
  }, [assessments, criteriasRaw]);

  // 5. Mutation to save results
  const { mutate, mutation } = useCustomMutation();
  const isSaving = mutation.isPending ?? false;

  const handleSaveResults = useCallback(() => {
    if (!topsisSteps || !period?.id) return;

    const results = topsisSteps.results.map((row) => ({
      assessmentId: row.id!,
      distancePositive: row.distancePositive,
      distanceNegative: row.distanceNegative,
      preferenceValue: row.preferenceValue,
      rank: row.rank,
      isEligible: row.isEligible,
    }));

    mutate(
      {
        url: "assessments/results/bulk",
        method: "post",
        values: {
          periodId: period.id,
          results,
        },
      },
      {
        onSuccess: () => {
          toast("Berhasil menyimpan hasil perhitungan TOPSIS.", {
            variant: "success",
          });
          invalidate({
            resource: "assessments",
            invalidates: ["list", "many"],
          });
        },
        onError: (error: any) => {
          toast(
            error?.response?.data?.message ??
              "Gagal menyimpan hasil perhitungan.",
            { variant: "danger" },
          );
        },
      },
    );
  }, [topsisSteps, period?.id, mutate, invalidate]);

  const isLoading =
    isPeriodLoading || isAssessmentsLoading || isCriteriasLoading;

  return (
    <Container maxWidth="full" variant="page" className="space-y-6">
      <LoadingScreen isLoading={isLoading} />

      <Heading as="h1" size="2xl" weight="bold">
        Perhitungan TOPSIS
      </Heading>

      {!period && !isPeriodLoading && (
        <Card className="p-4">
          <Text className="text-danger">
            Tidak ada periode aktif. Silakan aktifkan periode terlebih dahulu.
          </Text>
        </Card>
      )}

      {period && (
        <Card className="p-4">
          <Text>
            Periode Aktif: <strong>{period.name}</strong> (
            {new Date(period.startDate).toLocaleDateString("id-ID")} -{" "}
            {new Date(period.endDate).toLocaleDateString("id-ID")})
          </Text>
        </Card>
      )}

      {!isLoading && assessments.length === 0 && period && (
        <EmptyState>
          <EmptyState.Media>
            <ClipboardDocumentCheckIcon className="h-12 w-12" />
          </EmptyState.Media>
          <EmptyState.Title>Belum ada penilaian</EmptyState.Title>
          <EmptyState.Description>
            Belum ada penilaian untuk periode ini. Silakan lakukan penilaian
            terlebih dahulu.
          </EmptyState.Description>
          <Link className={'no-underline'} href="/penilaian">
          <Button>Beri Penilaian</Button>
          </Link>
        </EmptyState>
        // <Card className="p-4">
        //   <Text className="text-warning">
        //     Belum ada penilaian untuk periode ini. Silakan lakukan penilaian
        //     terlebih dahulu.
        //   </Text>
        // </Card>
      )}

      {topsisSteps && (
        <div className="space-y-6">
          {/* Step1: Decision Matrix */}
          <Card className="p-4">
            <Heading as="h2" size="lg" weight="semibold" className="mb-3">
              1. Matriks Keputusan (X)
            </Heading>
            <Table aria-label="Matriks Keputusan">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Alternatif</Table.Column>
                    {criteriasRaw.map((c) => (
                      <Table.Column key={c.id}>
                        <CriteriaColumnHeader code={c.code} name={c.name} />
                      </Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body>
                    {topsisSteps.matrix.map((row, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>
                          {assessments[i]?.candidateName ?? `A${i + 1}`}
                        </Table.Cell>
                        {row.map((val, j) => (
                          <Table.Cell key={j}>{formatNumber(val)}</Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card>

          {/* Step 2: Normalized Matrix */}
          <Card className="p-4">
            <Heading as="h2" size="lg" weight="semibold" className="mb-3">
              2. Matriks Ternormalisasi (R)
            </Heading>
            <Table aria-label="Matriks Ternormalisasi">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Alternatif</Table.Column>
                    {criteriasRaw.map((c) => (
                      <Table.Column key={c.id}>
                        <CriteriaColumnHeader code={c.code} name={c.name} />
                      </Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body>
                    {topsisSteps.normalized.map((row, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>
                          {assessments[i]?.candidateName ?? `A${i + 1}`}
                        </Table.Cell>
                        {row.map((val, j) => (
                          <Table.Cell key={j}>{formatNumber(val)}</Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card>

          {/* Step 3: Weighted Normalized Matrix */}
          <Card className="p-4">
            <Heading as="h2" size="lg" weight="semibold" className="mb-3">
              3. Matriks Ternormalisasi Tertimbang (Y)
            </Heading>
            <Table aria-label="Matriks Tertimbang">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Alternatif</Table.Column>
                    {criteriasRaw.map((c) => (
                      <Table.Column key={c.id}>
                        <CriteriaColumnHeader code={c.code} name={c.name} />
                      </Table.Column>
                    ))}
                  </Table.Header>
                  <Table.Body>
                    {topsisSteps.weighted.map((row, i) => (
                      <Table.Row key={i}>
                        <Table.Cell>
                          {assessments[i]?.candidateName ?? `A${i + 1}`}
                        </Table.Cell>
                        {row.map((val, j) => (
                          <Table.Cell key={j}>{formatNumber(val)}</Table.Cell>
                        ))}
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card>

          {/* Step 4: Ideal Solutions */}
          <Card className="p-4">
            <Heading as="h2" size="lg" weight="semibold" className="mb-3">
              4. Solusi Ideal Positif (A⁺) dan Negatif (A⁻)
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Table aria-label="Solusi Ideal Positif">
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Kriteria</Table.Column>
                    <Table.Column>Nilai A⁺</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {criteriasRaw.map((c, j) => (
                      <Table.Row key={c.id}>
                        <Table.Cell>{c.code}</Table.Cell>
                        <Table.Cell>
                          {formatNumber(topsisSteps.idealPositive[j])}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
              <Table aria-label="Solusi Ideal Negatif">
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Kriteria</Table.Column>
                    <Table.Column>Nilai A⁻</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {criteriasRaw.map((c, j) => (
                      <Table.Row key={c.id}>
                        <Table.Cell>{c.code}</Table.Cell>
                        <Table.Cell>
                          {formatNumber(topsisSteps.idealNegative[j])}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table>
            </div>
          </Card>

          {/* Step 5-6: Distances & Preference */}
          <Card className="p-4">
            <Heading as="h2" size="lg" weight="semibold" className="mb-3">
              5. Jarak Euclidean & Nilai Preferensi
            </Heading>
            <Table aria-label="Jarak dan Preferensi">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Alternatif</Table.Column>
                    <Table.Column>D⁺ (Positif)</Table.Column>
                    <Table.Column>D⁻ (Negatif)</Table.Column>
                    <Table.Column>V (Preferensi)</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {topsisSteps.results.map((row) => (
                      <Table.Row key={row.index}>
                        <Table.Cell>
                          {assessments[row.index]?.candidateName ??
                            `A${row.index + 1}`}
                        </Table.Cell>
                        <Table.Cell>
                          {formatNumber(row.distancePositive)}
                        </Table.Cell>
                        <Table.Cell>
                          {formatNumber(row.distanceNegative)}
                        </Table.Cell>
                        <Table.Cell>
                          {formatNumber(row.preferenceValue)}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card>

          {/* Step 7: Final Results */}
          <Card className="p-4">
            <Heading as="h2" size="lg" weight="semibold" className="mb-3">
              6. Hasil Akhir & Ranking
            </Heading>
            {topsisSteps.hasTie && (
              <div className="mb-3">
                <Chip color="warning" variant="soft">
                  Peringatan: Terdeteksi kemungkinan tie (nilai preferensi yang
                  sangat dekat)
                </Chip>
              </div>
            )}
            <Table aria-label="Hasil Akhir">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>Rank</Table.Column>
                    <Table.Column>Alternatif</Table.Column>
                    <Table.Column>Nilai Preferensi</Table.Column>
                    <Table.Column>Status Kelayakan</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {[...topsisSteps.results]
                      .sort((a, b) => a.rank - b.rank)
                      .map((row) => (
                        <Table.Row key={row.index}>
                          <Table.Cell>
                            <Chip
                              size="sm"
                              color={row.rank === 1 ? "success" : "default"}
                              variant="soft"
                            >
                              {row.rank}
                            </Chip>
                          </Table.Cell>
                          <Table.Cell>
                            {assessments[row.index]?.candidateName ??
                              `A${row.index + 1}`}
                          </Table.Cell>
                          <Table.Cell>
                            {formatNumber(row.preferenceValue)}
                          </Table.Cell>
                          <Table.Cell>
                            <Chip
                              size="sm"
                              color={row.isEligible ? "success" : "danger"}
                              variant="soft"
                            >
                              {row.isEligible ? "Layak" : "Tidak Layak"}
                            </Chip>
                          </Table.Cell>
                        </Table.Row>
                      ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="lg"
              onPress={handleSaveResults}
              isPending={isSaving}
              isDisabled={topsisSteps.hasTie}
            >
              Simpan Hasil Perhitungan
            </Button>
          </div>
        </div>
      )}
    </Container>
  );
}
