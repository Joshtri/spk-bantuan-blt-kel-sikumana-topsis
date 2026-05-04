import { useParsed } from "@refinedev/core";
import { QuestionnaireWrapper } from "@/features/assessments/components";

export default function AssessmentCreatePage() {
  const { id } = useParsed();

  if (!id) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-20 text-center">
        <p className="text-base font-semibold text-default-700">
          Calon penerima tidak ditemukan
        </p>
        <p className="text-sm text-default-500">
          Akses halaman penilaian melalui daftar Calon Penerima.
        </p>
      </div>
    );
  }

  return <QuestionnaireWrapper candidateId={String(id)} />;
}
