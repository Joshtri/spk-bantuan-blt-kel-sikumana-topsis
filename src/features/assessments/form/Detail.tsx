import { AutoCompleteInput } from "@/components/inputs/AutoCompleteInput";
import { useList, useParsed } from "@refinedev/core";
import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";

interface CriteriaOption {
  id: string;
  name: string;
  code: string;
}

interface CriteriaScaleOption {
  id: string;
  criteriaId: string;
  criteriaName: string;
  scaleValue: number;
  category: string;
}

interface PeriodOption {
  id: string;
  name: string;
}

interface CandidateOption {
  id: string;
  recipientName: string;
}

interface UserOption {
  id: string;
  username: string;
}

interface AssessmentDetail {
  criteriaScaleId: string;
}

function CriteriaScaleSelector() {
  const { setValue, getValues } = useFormContext();
  const { id: editId } = useParsed();
  const isEdit = !!editId;

  const { data: criteriasData } = useList<CriteriaOption>({
    resource: "criterias",
    pagination: { pageSize: 100, current: 1, mode: "server" },
  });

  const { data: scalesData } = useList<CriteriaScaleOption>({
    resource: "criteria-scales",
    pagination: { pageSize: 1000, current: 1, mode: "server" },
  });

  const criterias = criteriasData?.data ?? [];
  const scales = scalesData?.data ?? [];

  const scalesByCriteriaId = useMemo(() => {
    return scales.reduce(
      (acc, scale) => {
        const key = scale.criteriaId;
        if (!acc[key]) acc[key] = [];
        acc[key].push(scale);
        return acc;
      },
      {} as Record<string, CriteriaScaleOption[]>,
    );
  }, [scales]);

  // Pre-populate per-criteria dropdowns from existing details in edit mode
  useEffect(() => {
    if (!isEdit || scales.length === 0) return;
    const details = getValues("details") as AssessmentDetail[] | undefined;
    if (!Array.isArray(details) || details.length === 0) return;

    details.forEach((detail) => {
      const scale = scales.find((s) => s.id === detail.criteriaScaleId);
      if (scale) {
        setValue(`criteriaScale_${scale.criteriaId}`, scale.id);
      }
    });
  }, [isEdit, scales, getValues, setValue]);

  if (criterias.length === 0) return null;

  return (
    <div className="mt-6">
      <p className="text-sm font-semibold mb-1">Penilaian per Kriteria</p>
      <p className="text-xs text-default-500 mb-4">
        Pilih satu skala untuk setiap kriteria penilaian
      </p>
      {criterias.map((criteria) => {
        const criteriaId = criteria.id;
        const criteriaScales = scalesByCriteriaId[criteriaId] ?? [];
        const scaleOptions = criteriaScales.map((s) => ({
          key: s.id,
          label: `${s.category} — Nilai: ${s.scaleValue}`,
          value: s.id,
        }));

        return (
          <AutoCompleteInput
            key={criteriaId}
            fieldName={`criteriaScale_${criteriaId}`}
            fieldLabel={`${criteria.name} (${criteria.code})`}
            options={scaleOptions}
            isRequired
            placeholder="Pilih skala..."
          />
        );
      })}
    </div>
  );
}

export default function DetailAssessment() {
  const { data: periodsData } = useList<PeriodOption>({
    resource: "periods",
    pagination: { pageSize: 100, current: 1, mode: "server" },
  });

  const { data: candidatesData } = useList<CandidateOption>({
    resource: "candidate-recipients",
    pagination: { pageSize: 100, current: 1, mode: "server" },
  });

  const { data: usersData } = useList<UserOption>({
    resource: "users",
    pagination: { pageSize: 100, current: 1, mode: "server" },
  });

  const periodOptions = (periodsData?.data ?? []).map((p) => ({
    key: p.id,
    label: p.name,
    value: p.id,
  }));

  const candidateOptions = (candidatesData?.data ?? []).map((c) => ({
    key: c.id,
    label: c.recipientName,
    value: c.id,
  }));

  const userOptions = (usersData?.data ?? []).map((u) => ({
    key: u.id,
    label: u.username,
    value: u.id,
  }));

  return (
    <div>
      <AutoCompleteInput
        fieldName="periodId"
        fieldLabel="Periode"
        options={periodOptions}
        isRequired
      />
      <AutoCompleteInput
        fieldName="candidateId"
        fieldLabel="Calon Penerima"
        options={candidateOptions}
        isRequired
      />
      <AutoCompleteInput
        fieldName="assessedByUserId"
        fieldLabel="Dinilai Oleh"
        options={userOptions}
        isRequired
      />

      <CriteriaScaleSelector />
    </div>
  );
}
