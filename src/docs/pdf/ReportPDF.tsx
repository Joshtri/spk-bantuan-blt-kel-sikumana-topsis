import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { formatDateTimeShort } from "@/utils/date";

export interface IAssessmentReportRow {
  assessmentId: string;
  candidateId: string;
  candidateName: string;
  candidateNik: string;
  preferenceValue: number | null;
  rank: number | null;
  isEligible: boolean;
  distancePositive: number | null;
  distanceNegative: number | null;
}

export interface IReportData {
  periodId: string;
  periodName: string;
  periodStartDate: string;
  periodEndDate: string;
  data: IAssessmentReportRow[];
}

export const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", backgroundColor: "#fff" },
  header: { marginBottom: 24 },
  title: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#0f172a", marginBottom: 4 },
  subtitle: { fontSize: 10, color: "#64748b" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#e2e8f0", marginVertical: 16 },
  statsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statBox: { flex: 1, backgroundColor: "#f8fafc", padding: 12, borderRadius: 6, borderWidth: 1, borderColor: "#e2e8f0" },
  statLabel: { fontSize: 8, color: "#64748b", marginBottom: 4, textTransform: "uppercase" },
  statValue: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#0f172a" },
  tableHeader: { flexDirection: "row", backgroundColor: "#0f172a", padding: "8 10", borderRadius: 4, marginBottom: 2 },
  tableHeaderCell: { fontSize: 8, color: "#fff", fontFamily: "Helvetica-Bold", flex: 1 },
  tableRow: { flexDirection: "row", padding: "7 10", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  tableCell: { fontSize: 9, color: "#334155", flex: 1 },
  tableCellBold: { fontSize: 9, color: "#0f172a", fontFamily: "Helvetica-Bold", flex: 1 },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontSize: 8 },
  eligible: { color: "#16a34a", backgroundColor: "#dcfce7" },
  notEligible: { color: "#dc2626", backgroundColor: "#fee2e2" },
  footer: { marginTop: 24, fontSize: 8, color: "#94a3b8", textAlign: "center" },
});

interface ReportPDFProps {
  periodName: string;
  rows: IAssessmentReportRow[];
}

export const ReportPDF = ({ periodName, rows }: ReportPDFProps) => {
  const eligible = rows.filter((r) => r.isEligible).length;
  const validRows = rows.filter((r) => r.preferenceValue !== null);
  const avg =
    validRows.length > 0
      ? validRows.reduce((s, r) => s + (r.preferenceValue ?? 0), 0) /
        validRows.length
      : 0;

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>Laporan Hasil Penilaian</Text>
          <Text style={pdfStyles.subtitle}>Periode: {periodName}</Text>
        </View>
        <View style={pdfStyles.divider} />

        <View style={pdfStyles.statsRow}>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statLabel}>Total Kandidat</Text>
            <Text style={pdfStyles.statValue}>{rows.length}</Text>
          </View>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statLabel}>Layak</Text>
            <Text style={pdfStyles.statValue}>{eligible}</Text>
          </View>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statLabel}>Tidak Layak</Text>
            <Text style={pdfStyles.statValue}>{rows.length - eligible}</Text>
          </View>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statLabel}>Rata-rata Nilai</Text>
            <Text style={pdfStyles.statValue}>{(avg * 100).toFixed(1)}%</Text>
          </View>
        </View>

        <View style={pdfStyles.tableHeader}>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 0.4 }]}>RANK</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 2 }]}>NAMA KANDIDAT</Text>
          <Text style={[pdfStyles.tableHeaderCell, { flex: 1.5 }]}>NIK</Text>
          <Text style={pdfStyles.tableHeaderCell}>NILAI</Text>
          <Text style={pdfStyles.tableHeaderCell}>STATUS</Text>
        </View>

        {rows.map((row, i) => (
          <View key={row.assessmentId} style={[pdfStyles.tableRow, { backgroundColor: i % 2 === 0 ? "#fff" : "#f8fafc" }]}>
            <Text style={[pdfStyles.tableCellBold, { flex: 0.4 }]}>
              {row.rank !== null ? `#${row.rank}` : "-"}
            </Text>
            <Text style={[pdfStyles.tableCell, { flex: 2 }]}>{row.candidateName}</Text>
            <Text style={[pdfStyles.tableCell, { flex: 1.5 }]}>{row.candidateNik}</Text>
            <Text style={pdfStyles.tableCell}>
              {row.preferenceValue !== null
                ? `${(row.preferenceValue * 100).toFixed(2)}%`
                : "-"}
            </Text>
            <Text style={[pdfStyles.tableCell, row.isEligible ? pdfStyles.eligible : pdfStyles.notEligible]}>
              {row.isEligible ? "Layak" : "Tidak Layak"}
            </Text>
          </View>
        ))}

        <Text style={pdfStyles.footer}>
          Dicetak pada {formatDateTimeShort(new Date().toISOString())} · Sistem Penilaian Kandidat
        </Text>
      </Page>
    </Document>
  );
};
