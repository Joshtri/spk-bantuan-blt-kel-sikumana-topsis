import { useState } from "react";
import { useCustom } from "@refinedev/core";
import {
  Select,
  ListBox,
  Button,
  Table,
  Chip,
  Card,
  type Key,
} from "@heroui/react";
import { pdf } from "@react-pdf/renderer";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";

import { Heading } from "@/components/heading";
import { Text } from "@/components/text";
import LoadingScreen from "@/components/loading/LoadingScreen";
import { ApiResponse } from "@/interfaces/IBaseEntity";
import EmptyState from "@/components/empty-state";
import {
  ReportPDF,
  type IAssessmentReportRow,
  type IReportData,
} from "@/docs/pdf/ReportPDF";
import { usePeriodsOptions } from "@/features/periods/usePeriodsOptions";
import { formatDateShort } from "@/utils/date";

export default function ReportsPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<Key | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Fetch periods from lookup API
  const { options: periodsOptions, isLoading: isPeriodsLoading } =
    usePeriodsOptions();

  // Fetch report data for selected period
  const { result: reportResult, query: reportQuery } = useCustom<
    ApiResponse<IReportData>
  >({
    url: `assessments/report/by-period?periodId=${selectedPeriodId}`,
    method: "get",
    queryOptions: {
      enabled: !!selectedPeriodId,
    },
  });

  const reportData = reportResult?.data?.data ?? null;
  const rows: IAssessmentReportRow[] = Array.isArray(reportData?.data)
    ? reportData.data
    : [];

  const selectedPeriodLabel =
    reportData?.periodName ??
    periodsOptions.find((p) => String(p.value) === String(selectedPeriodId))
      ?.label ??
    "";

  const eligible = rows.filter((r) => r.isEligible).length;
  const validRows = rows.filter((r) => r.preferenceValue !== null);
  const avgValue =
    validRows.length > 0
      ? validRows.reduce((s, r) => s + (r.preferenceValue ?? 0), 0) /
        validRows.length
      : 0;

  const handleDownloadPDF = async () => {
    if (!selectedPeriodLabel) return;
    setIsDownloading(true);
    try {
      const blob = await pdf(
        <ReportPDF periodName={selectedPeriodLabel} rows={rows} />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `laporan-${selectedPeriodLabel.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setIsDownloading(false);
    }
  };

  const isLoading = isPeriodsLoading || reportQuery.isLoading;

  return (
    <div className="min-h-screen p-6 space-y-6">
      <LoadingScreen isLoading={isLoading} />

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading as="h1" size="xl">
            Laporan Hasil Penilaian
          </Heading>
          <Text muted className="mt-0.5">
            Pilih periode untuk menampilkan hasil perhitungan
          </Text>
        </div>

        <div className="flex items-center gap-3">
          <Select
            aria-label="Pilih periode untuk laporan"
            variant="secondary"
            className="w-52"
            placeholder="Pilih Periode"
            value={selectedPeriodId}
            onChange={(value) => setSelectedPeriodId(value)}
          >
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {periodsOptions.map((p) => (
                  <ListBox.Item
                    key={String(p.value)}
                    id={String(p.value)}
                    textValue={p.label}
                  >
                    {p.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>

          <Button
            aria-label="Download laporan penilaian dalam format PDF"
            variant="primary"
            size="sm"
            isDisabled={!selectedPeriodId}
            isPending={isDownloading}
            onPress={handleDownloadPDF}
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Period Info Bar */}
      {reportData && (
        <Card className="bg-primary-50 border border-primary-100 p-4">
          <div className="flex items-center gap-2 text-sm text-primary-700">
            <span className="font-medium">{reportData.periodName}</span>
            <span className="text-primary-400">·</span>
            <span>
              {formatDateShort(reportData.periodStartDate)} –{" "}
              {formatDateShort(reportData.periodEndDate)}
            </span>
          </div>
        </Card>
      )}

      {/* Empty State */}
      {!selectedPeriodId && (
        <EmptyState>
          <EmptyState.Title>Belum ada data ditampilkan</EmptyState.Title>
          <EmptyState.Description>
            Pilih periode terlebih dahulu untuk melihat laporan
          </EmptyState.Description>
        </EmptyState>
      )}

      {/* Stats Cards */}
      {selectedPeriodId && rows.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Kandidat", value: rows.length },
              { label: "Kandidat Layak", value: eligible },
              { label: "Tidak Layak", value: rows.length - eligible },
              {
                label: "Rata-rata Nilai",
                value: `${(avgValue * 100).toFixed(1)}%`,
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                // shadow="none"
                className="border border-divider"
              >
                <div className="p-4 space-y-1">
                  <Text
                    size="xs"
                    muted
                    className="uppercase tracking-wide font-medium"
                  >
                    {stat.label}
                  </Text>
                  <Text as="p" weight="bold">
                    {stat.value}
                  </Text>
                </div>
              </Card>
            ))}
          </div>

          {/* Table */}
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Hasil penilaian">
                <Table.Header>
                  <Table.Column isRowHeader>RANK</Table.Column>
                  <Table.Column>NAMA KANDIDAT</Table.Column>
                  <Table.Column>NIK</Table.Column>
                  <Table.Column>PREFERENCE VALUE</Table.Column>
                  <Table.Column>STATUS</Table.Column>
                </Table.Header>
                <Table.Body
                  items={rows.map((r) => ({ ...r, id: r.assessmentId }))}
                  renderEmptyState={() => (
                    <Text muted className="py-6 text-center">
                      Belum ada data penilaian untuk periode ini
                    </Text>
                  )}
                >
                  {(row) => (
                    <Table.Row key={row.assessmentId}>
                      <Table.Cell>
                        <Text weight="semibold" size="sm">
                          {row.rank !== null ? `#${row.rank}` : "-"}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text weight="medium">{row.candidateName}</Text>
                      </Table.Cell>
                      <Table.Cell>
                        <Text muted size="sm" className="tabular-nums">
                          {row.candidateNik}
                        </Text>
                      </Table.Cell>
                      <Table.Cell>
                        {row.preferenceValue !== null ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-1.5 rounded-full bg-default-100 overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{
                                  width: `${row.preferenceValue * 100}%`,
                                }}
                              />
                            </div>
                            <Text size="sm" className="tabular-nums">
                              {(row.preferenceValue * 100).toFixed(2)}%
                            </Text>
                          </div>
                        ) : (
                          <Text muted size="sm">
                            Belum dihitung
                          </Text>
                        )}
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
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </>
      )}
    </div>
  );
}
