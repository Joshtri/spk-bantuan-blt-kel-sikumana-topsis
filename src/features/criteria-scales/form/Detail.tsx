import { AutoCompleteInput } from "@/components/inputs/AutoCompleteInput";
import { NumberInput } from "@/components/inputs/NumberInput";
import { TextAreaInput } from "@/components/inputs/TextAreaInput";
import { TextInput } from "@/components/inputs/TextInput";
import { useCriteriasOptions } from "@/features/criterias/useCriteriasOptions";
import { useParsed } from "@refinedev/core";

export default function DetailCriteriaScale() {
  const { id } = useParsed();
  const isEdit = !!id;

  const { options: criteriaOptions } = useCriteriasOptions();

  return (
    <div>
      <AutoCompleteInput
        fieldName="criteriaId"
        fieldLabel="Kriteria"
        options={criteriaOptions}
        isRequired={!isEdit}
        isDisabled={isEdit}
      />
      <TextInput fieldName="category" fieldLabel="Kategori" isRequired />
      <NumberInput
        fieldName="scaleValue"
        fieldLabel="Nilai Skala"
        isRequired
        additionalRules={{
          min: {
            value: 1,
            message: "Nilai Skala harus lebih besar atau sama dengan 1",
          },
        }}
      />
      <TextAreaInput fieldName="description" fieldLabel="Deskripsi" />
    </div>
  );
}
